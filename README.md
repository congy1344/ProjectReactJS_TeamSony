# Furniture Store

Một ứng dụng web bán hàng bàn ghế được xây dựng bằng React, Vite, Material UI và Tailwind CSS.

## Tính năng

- Hiển thị danh sách sản phẩm
- Tìm kiếm và lọc sản phẩm theo danh mục
- Thêm sản phẩm vào giỏ hàng
- Quản lý số lượng sản phẩm trong giỏ hàng
- Thanh toán đơn hàng
- Giao diện quản trị viên để quản lý sản phẩm

## Cài đặt

1. Clone repository:

```bash
git clone <repository-url>
cd furniture-store
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Chạy ứng dụng:

```bash
npm run dev
```

4. Build ứng dụng:

```bash
npm run build
```

## Công nghệ sử dụng

- React
- Vite
- Material UI
- Tailwind CSS
- Redux Toolkit
- React Router

## Deployment

Dự án có thể được deploy lên Vercel:

1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Vercel sẽ tự động build và deploy ứng dụng

## Cấu trúc thư mục

```
furniture-store/
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── Cart.jsx
│   │   └── Admin.jsx
│   │
│   ├── store/
│   │   ├── store.js
│   │   └── cartSlice.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│
├── index.html
└── package.json
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
