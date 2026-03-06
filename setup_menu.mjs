import fs from 'fs';

const PATH = 'src/data/vtt_structured.json';

const newData = {
    "sliders": [
        "https://bizweb.dktcdn.net/100/340/361/themes/913887/assets/slider_2.jpg",
        "https://bizweb.dktcdn.net/100/340/361/themes/913887/assets/slider_1.jpg",
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/340/361/collections/adidas-thumb.jpg"
    ],
    "menuItems": [
        {
            "name": "Trang chủ",
            "link": "/",
            "subItems": []
        },
        {
            "name": "Giới thiệu",
            "link": "/gioi-thieu",
            "subItems": []
        },
        {
            "name": "THƯƠNG HIỆU",
            "link": "/san-pham",
            "subGroups": [
                {
                    "groupName": "",
                    "items": [
                        { "name": "adidas", "link": "/chuyen-muc/adidas" },
                        { "name": "ASICS", "link": "/chuyen-muc/asics" }
                    ]
                },
                {
                    "groupName": "",
                    "items": [
                        { "name": "Nike", "link": "/chuyen-muc/nike" },
                        { "name": "le coq sportif", "link": "/chuyen-muc/le-coq-sportif" }
                    ]
                },
                {
                    "groupName": "",
                    "items": [
                        { "name": "Li-Ning", "link": "/chuyen-muc/li-ning" },
                        { "name": "361° Sport", "link": "/chuyen-muc/361-sport" }
                    ]
                },
                {
                    "groupName": "",
                    "items": [
                        { "name": "GRENDENE", "link": "/chuyen-muc/grendene" },
                        { "name": "RIDER", "link": "/chuyen-muc/rider" },
                        { "name": "IPANEMA", "link": "/chuyen-muc/ipanema" },
                        { "name": "ZAXY", "link": "/chuyen-muc/zaxy" },
                        { "name": "GRENDHA", "link": "/chuyen-muc/grendha" }
                    ]
                }
            ]
        },
        {
            "name": "MÔN THỂ THAO",
            "link": "/san-pham",
            "subItems": [
                { "name": "Pickleball", "link": "/chuyen-muc/pickleball" },
                { "name": "Cầu lông", "link": "/chuyen-muc/cau-long" },
                { "name": "Golf", "link": "/chuyen-muc/golf" },
                { "name": "Bóng đá", "link": "/chuyen-muc/bong-da" },
                { "name": "Chạy bộ", "link": "/chuyen-muc/chay-bo" },
                { "name": "Tennis", "link": "/chuyen-muc/tennis" },
                { "name": "Bóng rổ", "link": "/chuyen-muc/bong-ro" },
                { "name": "Tập luyện", "link": "/chuyen-muc/tap-luyen" }
            ]
        },
        {
            "name": "SẢN PHẨM MỚI",
            "link": "/chuyen-muc/new-arrivals",
            "subItems": []
        },
        {
            "name": "NAM",
            "link": "/chuyen-muc/nam",
            "subGroups": [
                {
                    "groupName": "ÁO NAM",
                    "items": [
                        { "name": "Áo gió", "link": "/chuyen-muc/ao-gio-nam" },
                        { "name": "Áo nỉ", "link": "/chuyen-muc/ao-ni-nam" },
                        { "name": "Áo khoác", "link": "/chuyen-muc/ao-khoac-nam" },
                        { "name": "Áo dài tay", "link": "/chuyen-muc/ao-dai-tay-nam" },
                        { "name": "Áo phao & lông vũ", "link": "/chuyen-muc/ao-phao-long-vu-nam" },
                        { "name": "Áo T-shirt", "link": "/chuyen-muc/ao-t-shirt-nam" },
                        { "name": "Áo polo", "link": "/chuyen-muc/ao-polo-nam" },
                        { "name": "Áo ba lỗ", "link": "/chuyen-muc/ao-ba-lo-nam" }
                    ]
                },
                {
                    "groupName": "QUẦN NAM",
                    "items": [
                        { "name": "Quần dài", "link": "/chuyen-muc/quan-dai-nam" },
                        { "name": "Quần gió", "link": "/chuyen-muc/quan-gio-nam" },
                        { "name": "Quần nỉ", "link": "/chuyen-muc/quan-ni-nam" },
                        { "name": "Quần short", "link": "/chuyen-muc/quan-short-nam" }
                    ]
                },
                {
                    "groupName": "GIÀY NAM",
                    "items": [
                        { "name": "Giày chạy bộ", "link": "/chuyen-muc/giay-chay-bo-nam" },
                        { "name": "Giày pickleball", "link": "/chuyen-muc/giay-pickleball-nam" },
                        { "name": "Giày thời trang", "link": "/chuyen-muc/giay-thoi-trang-nam" },
                        { "name": "Giày golf", "link": "/chuyen-muc/giay-golf-nam" },
                        { "name": "Giày bóng rổ", "link": "/chuyen-muc/giay-bong-ro-nam" },
                        { "name": "Giày tennis", "link": "/chuyen-muc/giay-tennis-nam" },
                        { "name": "Giày bóng đá", "link": "/chuyen-muc/giay-bong-da-nam" },
                        { "name": "Giày cầu lông", "link": "/chuyen-muc/giay-cau-long-nam" }
                    ]
                },
                {
                    "groupName": "PHỤ KIỆN NAM",
                    "items": [
                        { "name": "Tất", "link": "/chuyen-muc/tat-nam" },
                        { "name": "Mũ", "link": "/chuyen-muc/mu-nam" },
                        { "name": "Dép", "link": "/chuyen-muc/dep-nam" },
                        { "name": "Balo", "link": "/chuyen-muc/balo-nam" },
                        { "name": "Túi", "link": "/chuyen-muc/tui-nam" },
                        { "name": "Thắt lưng", "link": "/chuyen-muc/that-lung-nam" },
                        { "name": "Găng tay", "link": "/chuyen-muc/gang-tay-nam" }
                    ]
                }
            ]
        },
        {
            "name": "NỮ",
            "link": "/chuyen-muc/nu",
            "subGroups": [
                {
                    "groupName": "ÁO NỮ",
                    "items": [
                        { "name": "Áo gió", "link": "/chuyen-muc/ao-gio-nu" },
                        { "name": "Áo khoác", "link": "/chuyen-muc/ao-khoac-nu" },
                        { "name": "Áo nỉ", "link": "/chuyen-muc/ao-ni-nu" },
                        { "name": "Áo dài tay", "link": "/chuyen-muc/ao-dai-tay-nu" },
                        { "name": "Áo phao & lông vũ", "link": "/chuyen-muc/ao-phao-long-vu-nu" },
                        { "name": "Áo T-shirt", "link": "/chuyen-muc/ao-t-shirt-nu" },
                        { "name": "Áo polo", "link": "/chuyen-muc/ao-polo-nu" },
                        { "name": "Áo sát nách", "link": "/chuyen-muc/ao-sat-nach-nu" },
                        { "name": "Áo bra", "link": "/chuyen-muc/ao-bra-nu" }
                    ]
                },
                {
                    "groupName": "QUẦN NỮ",
                    "items": [
                        { "name": "Quần dài", "link": "/chuyen-muc/quan-dai-nu" },
                        { "name": "Quần nỉ", "link": "/chuyen-muc/quan-ni-nu" },
                        { "name": "Quần gió", "link": "/chuyen-muc/quan-gio-nu" },
                        { "name": "Quần short", "link": "/chuyen-muc/quan-short-nu" },
                        { "name": "Quần legging", "link": "/chuyen-muc/quan-legging-nu" },
                        { "name": "Váy & chân váy", "link": "/chuyen-muc/vay-chan-vay-nu" }
                    ]
                },
                {
                    "groupName": "GIÀY NỮ",
                    "items": [
                        { "name": "Giày chạy bộ", "link": "/chuyen-muc/giay-chay-bo-nu" },
                        { "name": "Giày pickleball", "link": "/chuyen-muc/giay-pickleball-nu" },
                        { "name": "Giày thời trang", "link": "/chuyen-muc/giay-thoi-trang-nu" },
                        { "name": "Giày tập luyện", "link": "/chuyen-muc/giay-tap-luyen-nu" },
                        { "name": "Giày tennis", "link": "/chuyen-muc/giay-tennis-nu" },
                        { "name": "Giày golf", "link": "/chuyen-muc/giay-golf-nu" },
                        { "name": "Giày cầu lông", "link": "/chuyen-muc/giay-cau-long-nu" }
                    ]
                },
                {
                    "groupName": "PHỤ KIỆN NỮ",
                    "items": [
                        { "name": "Tất", "link": "/chuyen-muc/tat-nu" },
                        { "name": "Mũ", "link": "/chuyen-muc/mu-nu" },
                        { "name": "Dép", "link": "/chuyen-muc/dep-nu" },
                        { "name": "Balo", "link": "/chuyen-muc/balo-nu" },
                        { "name": "Túi", "link": "/chuyen-muc/tui-nu" },
                        { "name": "Găng tay", "link": "/chuyen-muc/gang-tay-nu" }
                    ]
                }
            ]
        },
        {
            "name": "TRẺ EM",
            "link": "/chuyen-muc/tre-em",
            "subItems": [
                { "name": "Bé trai", "link": "/chuyen-muc/be-trai" },
                { "name": "Bé gái (8 - 16 tuổi)", "link": "/chuyen-muc/be-gai" }
            ]
        },
        {
            "name": "OUTLET",
            "link": "/chuyen-muc/outlet",
            "subItems": [
                { "name": "Ưu đãi 20% - 30%", "link": "/chuyen-muc/uu-dai-20-30" },
                { "name": "Ưu đãi 40% - 50%+", "link": "/chuyen-muc/uu-dai-40-50" },
                { "name": "Đồng giá", "link": "/chuyen-muc/dong-gia" }
            ]
        },
        {
            "name": "HỆ THỐNG CỬA HÀNG",
            "link": "/lien-he",
            "subItems": []
        }
    ]
};

fs.writeFileSync(PATH, JSON.stringify(newData, null, 2));
console.log("Xây dựng thành công cấu trúc Mega Menu vĩ mô 100% giống thiết kế.");
