// Sử dụng biến môi trường hoặc cấu hình mặc định
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://furniture-api-0bbp.onrender.com" // URL của API đã deploy
    : "http://localhost:10000"); // URL local

console.log("Using API URL:", BASE_URL);

export const api = {
  // Thêm phương thức để lấy BASE_URL
  getBaseUrl: () => BASE_URL,

  // Đảm bảo API getAllProducts hoạt động đúng
  getAllProducts: async () => {
    try {
      console.log("Fetching all products from:", `${BASE_URL}/products`);
      const response = await fetch(`${BASE_URL}/products`);

      if (!response.ok) {
        console.error(
          "API response not OK:",
          response.status,
          response.statusText
        );
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("API returned products:", data.length);

      // Đảm bảo mỗi sản phẩm có giá
      const safeData = data.map((product) => ({
        ...product,
        price: product.price || product.basePrice || 0,
      }));

      return safeData;
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (category) => {
    try {
      const response = await fetch(`${BASE_URL}/products?category=${category}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      throw error;
    }
  },

  // Lấy sản phẩm nổi bật
  getFeaturedProducts: async () => {
    try {
      const response = await fetch(`${BASE_URL}/featured_products`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  // Cải thiện hàm tìm kiếm sản phẩm
  searchProducts: async (query) => {
    try {
      // Đảm bảo query không rỗng
      if (!query || query.trim() === "") {
        console.log("Empty query, returning all products");
        return await api.getAllProducts();
      }

      const trimmedQuery = query.trim();
      console.log(`Sending search request for: "${trimmedQuery}"`);

      // Sử dụng q thay vì name_like để tìm kiếm tổng quát hơn
      const response = await fetch(
        `${BASE_URL}/products?q=${encodeURIComponent(trimmedQuery)}`
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        `Search results for "${trimmedQuery}":`,
        data.length,
        "items found"
      );
      return data;
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw error;
    }
  },

  // Thêm hàm lấy sản phẩm bestseller
  getBestsellers: async () => {
    try {
      // Sử dụng categories_like để tìm sản phẩm có category là Bestsellers
      const response = await fetch(
        `${BASE_URL}/products?categories_like=Bestsellers`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching bestseller products:", error);
      throw error;
    }
  },
};
