import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

const URLS_FILE = 'danh_sach_url_phan_loai_san_pham.txt';
const OUTPUT_FILE = 'maxxsport_products_links.json';
const FAILED_FILE = 'maxxsport_failed_urls.json';

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8'
};

function getUrls() {
    try {
        const content = fs.readFileSync(URLS_FILE, 'utf8');
        return content.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && line.startsWith('http'));
    } catch (e) {
        console.error("Lỗi đọc file URL:", e);
        return [];
    }
}

function parseUrlInfo(urlStr) {
    try {
        const urlObj = new URL(urlStr);
        const path = urlObj.pathname;
        const brand = path.split('/')[1] || ''; // e.g. /adidas -> adidas

        let gender = 'Mặc định';
        let sport = 'Khác';
        let priceRange = 'Mặc định';
        let itemType = 'Khác';

        // Phân tích query string
        const q = urlObj.searchParams.get('q') || '';
        const decodedQ = decodeURIComponent(q);

        if (decodedQ.includes('(Nam)')) gender = 'Nam';
        else if (decodedQ.includes('(Nữ)')) gender = 'Nữ';
        else if (decodedQ.includes('(Bé Trai)')) gender = 'Bé Trai';
        else if (decodedQ.includes('(Bé Gái)')) gender = 'Bé Gái';
        else if (decodedQ.includes('(Unisex)')) gender = 'Unisex';
        else if (path.includes('-nam')) gender = 'Nam';
        else if (path.includes('-nu')) gender = 'Nữ';
        else if (path.includes('be-trai') || path.includes('be-gai')) gender = 'Trẻ Em';

        if (decodedQ.includes('BÓNG ĐÁ') || path.includes('bong-da')) sport = 'Bóng đá';
        else if (decodedQ.includes('BÓNG RỔ') || path.includes('bong-ro')) sport = 'Bóng rổ';
        else if (decodedQ.includes('CẦU LÔNG') || path.includes('cau-long')) sport = 'Cầu lông';
        else if (decodedQ.includes('TENNIS') || path.includes('tennis')) sport = 'Tennis';
        else if (decodedQ.includes('CHẠY BỘ') || path.includes('chay-bo')) sport = 'Chạy bộ';
        else if (decodedQ.includes('GOLF') || path.includes('golf')) sport = 'Golf';
        else if (path.includes('pickleball')) sport = 'Pickleball';
        else if (path.includes('tap-luyen')) sport = 'Tập luyện';

        if (decodedQ.includes('price_min:(<500000)')) priceRange = '< 500,000đ';
        else if (decodedQ.includes('>=500000 AND <=1000000')) priceRange = '500,000đ - 1,000,000đ';
        else if (decodedQ.includes('>=1000000 AND <=2000000')) priceRange = '1,000,000đ - 2,000,000đ';
        else if (decodedQ.includes('>=2000000 AND <=3000000')) priceRange = '2,000,000đ - 3,000,000đ';
        else if (decodedQ.includes('>=3000000 AND <=5000000')) priceRange = '3,000,000đ - 5,000,000đ';
        else if (decodedQ.includes('>=5000000')) priceRange = '> 5,000,000đ';

        if (decodedQ.includes('Áo')) itemType = 'Áo';
        else if (path.includes('ao-')) itemType = 'Áo';
        else if (path.includes('quan-')) itemType = 'Quần';
        else if (path.includes('giay-')) itemType = 'Giày';
        else if (path.includes('balo') || path.includes('tui-') || path.includes('gang-tay') || path.includes('tat-') || path.includes('mu-')) itemType = 'Phụ kiện';

        return { brand, gender, sport, priceRange, itemType, fullUrl: urlStr };
    } catch (e) {
        return { brand: 'Khác', gender: 'Mặc định', sport: 'Khác', priceRange: 'Mặc định', itemType: 'Khác', fullUrl: urlStr };
    }
}

const WAIT_TIME = 1000;
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function scrapePageUrl(pageUrl) {
    // Sửa view grid -> page sẽ lấy tự động thay vì cố định = 1
    // Chuyển view về chuỗi query chính
    const res = await axios.get(pageUrl, { headers: HEADERS });
    const $ = cheerio.load(res.data);
    const links = [];

    $('.item_product_main').each((i, el) => {
        const aTag = $(el).find('a').first();
        if (aTag.length === 0) return;

        let href = aTag.attr('href');
        if (href) {
            links.push(href);
        }
    });

    // Tính toán phân trang
    let hasNextPage = false;
    let nextPageUrl = '';
    const nextBtn = $('.pagination .page-item a[title="»"]');
    if (nextBtn.length > 0) {
        let nextPageLink = nextBtn.attr('href');
        if (nextPageLink) {
            hasNextPage = true;
            nextPageUrl = `https://maxxsport.com.vn${nextPageLink}`;
            // Đảm bảo vẫn thêm đoạn query param lọc vào nextPageUrl
            if (pageUrl.includes('?q=')) {
                const qMatch = pageUrl.match(/q=(.*?)&/);
                if (qMatch && qMatch[1] && !nextPageUrl.includes('q=')) {
                    nextPageUrl += `&q=${qMatch[1]}`;
                }
            }
        }
    }

    return { links, hasNextPage, nextPageUrl };
}

async function startScraping() {
    const rawUrls = getUrls();
    console.log(`Bắt đầu cào ${rawUrls.length} links danh mục chính...`);

    // Gộp trùng sản phẩm để tiết kiệm thời gian và lưu lại context
    const allProducts = new Map(); // key = url sản phẩm, value = array đặc tả
    const failedUrls = [];

    let count = 0;
    for (const url of rawUrls) {
        count++;
        console.log(`[${count}/${rawUrls.length}] Đang xử lý: ${url}`);

        const info = parseUrlInfo(url);
        let currentPage = url;
        let pageNum = 1;

        while (currentPage) {
            try {
                console.log(`  -> Trang ${pageNum}...`);
                const { links, hasNextPage, nextPageUrl } = await scrapePageUrl(currentPage);

                for (let itemLink of links) {
                    if (!allProducts.has(itemLink)) {
                        allProducts.set(itemLink, {
                            link: itemLink,
                            brands: new Set(),
                            genders: new Set(),
                            sports: new Set(),
                            categories: new Set()
                        });
                    }

                    const productData = allProducts.get(itemLink);
                    if (info.brand && info.brand !== 'Khác') productData.brands.add(info.brand);
                    if (info.gender && info.gender !== 'Mặc định') productData.genders.add(info.gender);
                    if (info.sport && info.sport !== 'Khác') productData.sports.add(info.sport);
                    if (info.itemType && info.itemType !== 'Khác') productData.categories.add(info.itemType);
                }

                if (hasNextPage && pageNum < 15) { // Limit 15 pages per category to be safe
                    pageNum++;
                    currentPage = nextPageUrl;
                    await delay(WAIT_TIME); // Chống block
                } else {
                    currentPage = null;
                }

            } catch (error) {
                console.error(`Lỗi cào ${currentPage}:`, error.message);
                failedUrls.push(currentPage);
                currentPage = null;
            }
        }

        await delay(WAIT_TIME);

        // Save intermediate results every 10 links
        if (count % 10 === 0) {
            saveData(allProducts, failedUrls);
            console.log(`-> (Đã auto save tiến độ tại mục ${count})`);
        }
    }

    saveData(allProducts, failedUrls);
    console.log(`Hoàn tất! Tổng cộng lượm được ${allProducts.size} Unique SP`);
}

function saveData(productsMap, failed) {
    const finalData = Array.from(productsMap.values()).map(p => ({
        link: p.link,
        brands: Array.from(p.brands),
        genders: Array.from(p.genders),
        sports: Array.from(p.sports),
        categories: Array.from(p.categories) // Type like Áo, Quần
    }));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
    fs.writeFileSync(FAILED_FILE, JSON.stringify(failed, null, 2));
}

startScraping();
