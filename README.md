🚀 1. Yêu cầu hệ thống
    Công cụ	Phiên bản khuyến nghị
    Node.js	>= 16.x
    npm	>= 8.x
    Git	(tuỳ chọn, để clone repo)

    node -v
    npm -v

cd sohoavanban-web
npm install

run: npm run dev

build: npm run build

Preview sau build: npm run preview




sohoavanban-web/           # Vue 3 + Vite + TypeScript
   ├─ src/
   │   ├─ api/             # Chứa logic gọi API Django REST (đăng nhập, upload OCR, lấy dữ liệu văn bản, …)
   │   ├─ assets/          # # Ảnh, icon, style
   │   ├─ components/      # Thành phần UI tái sử dụng: bảng, modal, upload, loader
   │   ├─ composables/     # Hook logic: useOCR, useAuth, useFetch
   │   ├─ views/           # Mỗi trang lớn: Trang chủ, Đăng nhập, Scan, Danh sách, Chi tiết văn bản, Thống kê
   │   ├─ store/           # Pinia state (lưu user, danh sách tài liệu, trạng thái OCR)
   │   ├─ router/          # Cấu hình route, điều hướng giữa các trang
   │   ├─ utils/           # Hàm tiện ích: convert file → base64, format text, log helper
   │   ├─ types/           # Interface TypeScript: Document, OCRResult, User
   │   ├─ App.vue          # Component gốc
   │   └─ main.ts          # Entry point ứng dụng
   ├─ index.html
   ├─ vite.config.ts
   ├─ package.json
   ├─ tsconfig.json
   └─ README.md