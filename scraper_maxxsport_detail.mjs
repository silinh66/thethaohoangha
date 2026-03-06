import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

const INPUT_FILE = 'maxxsport_products_links.json';
const OUTPUT_FILE = 'src/data/products.json';
const FAILED_FILE = 'maxxsport_failed_details.json';

// Batch size for concurrent requests
const CONCURRENCY = 30;
const WAIT_TIME = 1000;

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'vi,en;q=0.9'
};

function generateId(str) {
    return crypto.createHash('md5').update(str).digest('hex').substring(0, 10);
}

// Convert "1.300.000₫" to integer
function parsePrice(str) {
    if (!str) return 0;
    const cleanStr = str.replace(/[^0-9]/g, '');
    return parseInt(cleanStr, 10) || 0;
}

// Generates an array of specific taxonomy category slugs
function generateSlugs(brands, genders, sports, categories) {
    // Basic logic mapping attributes to slugs for routing
    const slugs = [];

    for (const b of brands) {
        slugs.push(b.toLowerCase().replace(/[\s\W]+/g, '-'));
    }

    for (const s of sports) {
        if (s === 'Khác') continue;
        slugs.push(s.toLowerCase().replace(/[\s\W]+/g, '-'));
    }

    if (slugs.length === 0) slugs.push('the-thao-chung');
    return slugs;
}

async function fetchHtml(url) {
    try {
        const fullUrl = `https://maxxsport.com.vn${url}`;
        const res = await axios.get(fullUrl, { headers: HEADERS, timeout: 15000 });
        return { html: res.data, success: true, url: fullUrl };
    } catch (e) {
        return { html: null, success: false, url };
    }
}

async function scrapeDetail(itemObj) {
    const link = itemObj.link;
    const { html, success, url } = await fetchHtml(link);
    if (!success) {
        return { error: true, link };
    }

    const $ = cheerio.load(html);

    // Core Info
    const rawName = $('h1.title-product').text().trim() || $('.title-product').text().trim();
    const name = rawName || link.split('/').pop().replace(/-/g, ' ');

    const priceTxt = $('.special-price .price').first().text().trim() || $('.product-price').first().text().trim();
    const compareTxt = $('.old-price .price').first().text().trim() || $('.compare-price').first().text().trim();

    const price = parsePrice(priceTxt);
    const originalPrice = parsePrice(compareTxt) || price;

    // Image
    let image = '';
    // Look for the first product image in the source that contains 'products/'
    $('img').each((i, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || '';
        if (src.includes('/products/') && src.includes('bizweb.dktcdn.net')) {
            // Convert to high res image if it's a thumb
            // e.g. //bizweb.dktcdn.net/thumb/medium/100/340/361/products/... -> //bizweb.dktcdn.net/100/340/361/products/...
            let hiResSrc = src.replace('/thumb/medium/', '/thumb/1024x1024/');
            // if we want max original res: hiResSrc = src.replace('/thumb/medium/', '/');
            image = hiResSrc.startsWith('//') ? `https:${hiResSrc}` : hiResSrc;
            return false; // Break loop
        }
    });

    if (!image) {
        // Fallback
        const imgEl = $('.product-featured-image').attr('src') || $('.lazyload.img-responsive').attr('data-src');
        if (imgEl) image = imgEl.startsWith('//') ? `https:${imgEl}` : imgEl;
    }

    // Description
    const rawDesc = $('#tab-1').html() || $('.product-description').html() || '';
    // Strip tags and heavily format
    let descTxt = $('<div>').html(rawDesc).text().trim().replace(/\s+/g, ' ').substring(0, 400);
    // Append standard postfix
    if (!descTxt) descTxt = "Sản phẩm thể thao cao cấp chính hãng từ MaxxSport.";

    // Sizes
    const sizes = [];
    $('.swatch-element').each((i, el) => {
        let sizeVal = $(el).attr('data-value');
        if (sizeVal) {
            sizes.push(sizeVal.trim());
        }
    });

    const subCategorySlugs = generateSlugs(itemObj.brands, itemObj.genders, itemObj.sports, itemObj.categories);

    // Map data to thethaohoangha standard format
    return {
        id: generateId(link),
        name: name,
        price: price,
        originalPrice: originalPrice,
        image: image,
        description: descTxt,
        sourceUrl: `https://maxxsport.com.vn${link}`,
        sizes: sizes,
        brand: itemObj.brands[0] || 'Maxxsport',
        gender: itemObj.genders[0] || 'Unisex',
        itemType: itemObj.categories[0] || 'Khác',
        sport: itemObj.sports[0] || 'Khác',
        subCategorySlugs: subCategorySlugs
    };
}

async function run() {
    console.log("Đọc mảng sản phẩm thô...");
    const rawData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    console.log(`Đã load ${rawData.length} items`);

    // Read existing 
    let existingProducts = [];
    try {
        existingProducts = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    } catch (e) { }
    console.log(`Đã load ${existingProducts.length} Items cũ trong Database`);

    const duplicateIds = new Set(existingProducts.map(p => p.id));
    const finalNewProducts = [];
    const failedList = [];

    // Chunks array to process concurrently
    for (let i = 0; i < rawData.length; i += CONCURRENCY) {
        const batch = rawData.slice(i, i + CONCURRENCY);
        console.log(`Đang chạy Batch ${i} tới ${i + CONCURRENCY}...`);

        const promises = batch.map(item => scrapeDetail(item));
        const results = await Promise.all(promises);

        for (const res of results) {
            if (res.error) {
                failedList.push(res.link);
            } else if (!duplicateIds.has(res.id) && res.name && res.image) {
                finalNewProducts.push(res);
                duplicateIds.add(res.id); // Tránh bị trùng cùng mảng
            } else if (!duplicateIds.has(res.id)) {
                // Log why it failed to meet condition
                console.log(`Bỏ qua: ${res.sourceUrl} - Name: ${!!res.name}, Img: ${!!res.image}`);
            }
        }

        await new Promise(r => setTimeout(r, WAIT_TIME)); // Delay between batches

        if (i % 200 === 0 && finalNewProducts.length > 0) {
            const tempMerged = [...existingProducts, ...finalNewProducts];
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tempMerged, null, 2));
            console.log(`  -> Đã auto save ${finalNewProducts.length} SP mới!`);
        }
    }

    const merged = [...existingProducts, ...finalNewProducts];
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(merged, null, 2));
    fs.writeFileSync(FAILED_FILE, JSON.stringify(failedList, null, 2));

    console.log(`Hoàn tất cào Detail! Tổng cộng ghi thành công ${finalNewProducts.length} mục mới.`);
    console.log(`Lỗi Link: ${failedList.length}`);
    console.log(`Tổng Database SP của Shop hiện tại: ${merged.length}`);
}

run();
