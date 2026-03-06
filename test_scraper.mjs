import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
    const url = 'https://maxxsport.com.vn/quan-short-tap-luyen-adidas-tech-essentials-2-trong-1-nam-ke9633';
    try {
        const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(res.data);

        console.log("Tìm ảnh JPG/PNG trong HTML:");
        $('img').each((i, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src') || '';
            if (src && (src.includes('jpg') || src.includes('png')) && !src.includes('logo')) {
                console.log(`- Ảnh ${i}: class="${$(el).attr('class')}", src="${src}"`);
            }
        });

    } catch (e) {
        console.error(e.message);
    }
}

test();
