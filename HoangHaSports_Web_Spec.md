# YÊU CẦU DỰ ÁN: WEBSITE THỂ THAO HOÀNG HÀ
**Mục tiêu:** Xây dựng một trang web giới thiệu sản phẩm tĩnh, tốc độ tải siêu tốc (<100ms), tối ưu SEO Local (Hải Dương), không có chức năng giỏ hàng/thanh toán. Mọi tương tác mua hàng/tư vấn đều điều hướng về Zalo và Hotline của chủ shop.

## 1. CÔNG NGHỆ SỬ DỤNG
* **Framework chính:** Astro (Chế độ Static Site Generation - SSG). Bắt buộc thiết lập "Zero-JS by default" để trang load tức thì.
* **Styling:** Tailwind CSS (Sử dụng utility-first để tối ưu file CSS cuối cùng nhỏ nhất).
* **Hosting & Deployment:** Firebase Hosting.
* **Tối ưu Hình ảnh:** Sử dụng component `<Image />` mặc định của Astro để tự động resize, lazy-load và chuyển đổi định dạng sang WebP/AVIF.

## 2. YÊU CẦU GIAO DIỆN (UI/UX) VÀ HIỆU NĂNG
* **Cấu trúc Tham khảo:** Clone giao diện, layout và bố cục giống trang `https://donglucsport.vn/` (Hiện đại, thể thao, chuyên nghiệp).
* **Màu sắc & Typography:** Sử dụng tone màu chủ đạo mạnh mẽ (ví dụ: Đen/Đỏ hoặc Xanh dương/Cam) trên nền trắng. Font chữ không chân (Sans-serif) như Inter hoặc Roboto.
* **Responsive:** Chuẩn Mobile-First, hiển thị hoàn hảo trên Mobile, Tablet, Desktop.
* **Hiệu năng tuyệt đối:** * Điểm Google Lighthouse phải đạt 100/100 ở mọi chỉ số (Performance, Accessibility, Best Practices, SEO).
    * Các hiệu ứng chuyển động, text chạy (marquee loop), banner dùng thuần CSS, hạn chế tối đa JS.

## 3. CẤU TRÚC TRANG VÀ BỐ CỤC CHI TIẾT
Dự án được xây dựng với cấu trúc UI bám sát Dongluc Sport, bao gồm:

### 3.1. Topbar & Header (Giữ cố định - Sticky khi cuộn)
* **Topbar (Dòng trên cùng):** Hiển thị các text nhỏ chạy ngang (Marquee loop) thông báo khuyến mãi, ví dụ: *"Tổng kho dụng cụ thể thao số 1 Hải Dương - Giao hàng và bảo hành tận nơi! - Hotline: [SĐT]"*.
* **Main Header:** * Trái: Logo "Thể thao Hoàng Hà".
    * Giữa: Thanh tìm kiếm sản phẩm (chỉ cần giao diện UI, chuyển hướng ra danh sách).
    * Phải: Nút Hotline và icon Zalo to, rõ ràng. (Bỏ hoàn toàn icon Giỏ hàng/Tài khoản).
* **Menu Navigation:** Thanh menu nằm ngang với các danh mục chính: *Trang chủ | Máy tập thể thao | Dụng cụ Cầu lông | Bóng đá | Bóng bàn | Bóng rổ - Bóng chuyền | Khách mua buôn*.

### 3.2. Hero Banner & Phân loại danh mục
* **Banner chính:** Hiển thị tràn viền (Full-width), hình ảnh chất lượng cao về không gian cửa hàng hoặc thiết bị nổi bật.
* **Danh mục nổi bật (Icon categories):** Ngay dưới banner, hiển thị một dải các icon tròn kèm tên danh mục (Chạy bộ, Xe đạp, Cầu lông, Bóng đá...) để khách click nhanh.

### 3.3. Các Section Sản phẩm (Trang chủ)
* Hiển thị dạng lưới (Grid) 4 cột trên Desktop, 2 cột trên Mobile.
* Chia thành các dải sản phẩm tương ứng với danh mục thực tế của cửa hàng:
    1. **Máy tập & Thiết bị phòng gym** (Máy chạy bộ, xe đạp tập, giàn tạ).
    2. **Thế giới Cầu lông** (Vợt, quả cầu, thảm, lưới).
    3. **Dụng cụ Bóng đá** (Quả bóng, giày, phụ kiện, cúp/cờ).
    4. **Dụng cụ Bóng bàn** (Bàn, vợt, mặt mút).
    5. **Bóng rổ & Bóng chuyền**.
* **Thẻ sản phẩm (Product Card):** * Ảnh sản phẩm vuông vức (Astro `<Image />`).
    * Tên sản phẩm đầy đủ (Thẻ `<h3>` 2 dòng).
    * Giá bán nổi bật.
    * Nút CTA: Thay vì "Thêm vào giỏ", dùng nút **"Nhắn Zalo Tư Vấn"** hoặc **"Gọi ngay"**.

### 3.4. Cấu trúc Trang Chi tiết Sản phẩm (Product Detail)
Giống bố cục Dongluc Sport nhưng loại bỏ phần mua hàng động:
* **Trái:** Hình ảnh chính của sản phẩm (có tính năng zoom CSS) và gallery ảnh thu nhỏ bên dưới.
* **Phải:** * Tên sản phẩm (Thẻ `<h1>`), Mã sản phẩm.
    * Giá bán.
    * Đoạn mô tả ngắn gọn về thông số kỹ thuật.
    * **Cụm Nút Liên hệ (Rất to & nổi bật):** Nút "Chat Zalo Mua Hàng" (Link: `https://zalo.me/[SĐT]?text=Tôi+cần+mua+[Tên_Sản_Phẩm]`) và nút "Gọi điện trực tiếp".
    * Cam kết cửa hàng (Bảo hành tại Hải Dương, Giao hàng nhanh).
* **Dưới:** Tab mô tả nội dung chi tiết bài viết, thông số kỹ thuật chuẩn SEO.

### 3.5. Nút Liên Hệ Nổi & Footer
* **Floating Action Buttons:** Nằm cố định ở góc dưới bên phải màn hình. Icon Zalo (màu xanh đặc trưng) và icon Điện thoại (rung lắc).
* **Footer:** Cấu trúc 4 cột chuẩn SEO. Nhấn mạnh Địa chỉ chi tiết tại TP. Hải Dương, Chính sách bán buôn, và iframe Google Maps của cửa hàng.

## 4. CẤU TRÚC SEO LOCAL (HẢI DƯƠNG) BẮT BUỘC
Mã nguồn phải bao gồm các cấu hình SEO sau trong thẻ `<head>`:
* **Meta Title:** `Tổng Kho Thể Thao Hoàng Hà | Dụng Cụ Thể Thao Số 1 Hải Dương`
* **Meta Description:** `Chuyên bán buôn, bán lẻ dụng cụ thể thao, máy tập, vợt cầu lông, bóng đá, bóng bàn chính hãng tại Hải Dương. Giá sỉ tốt nhất, bảo hành tận nơi.`
* **Schema Markup (JSON-LD):** ```html
    <script type="application/ld+json">
    {
      "@context": "[https://schema.org](https://schema.org)",
      "@type": "SportsStore",
      "name": "Thể thao Hoàng Hà",
      "image": "URL_LOGO_CUAHANG",
      "description": "Tổng kho bán buôn, bán lẻ dụng cụ thể thao uy tín số 1 tại Hải Dương.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "[ĐỊA CHỈ CHI TIẾT]",
        "addressLocality": "Hải Dương",
        "addressRegion": "Hải Dương",
        "addressCountry": "VN"
      },
      "telephone": "[SỐ_ĐIỆN_THOẠI]",
      "priceRange": "$$"
    }
    </script>
    ```

## 5. HƯỚNG DẪN DEPLOY (FIREBASE HOSTING)
Antigravity tạo file cấu hình Firebase để tối ưu Cache tĩnh.

1.  **Cấu trúc thư mục:** Source code trong `src/`, file tĩnh trong `public/`.
2.  **File cấu hình firebase.json** ở thư mục gốc:
    ```json
    {
      "hosting": {
        "public": "dist",
        "ignore": [
          "firebase.json",
          "**/.*",
          "**/node_modules/**"
        ],
        "headers": [
          {
            "source": "**/*.@(jpg|jpeg|gif|png|webp|avif|svg|css|js)",
            "headers": [
              {
                "key": "Cache-Control",
                "value": "max-age=31536000, immutable"
              }
            ]
          },
          {
            "source": "**/*.html",
            "headers": [
              {
                "key": "Cache-Control",
                "value": "public, max-age=3600, s-maxage=86400"
              }
            ]
          }
        ]
      }
    }
    ```