// Đảm bảo API hoạt động đúng. Nếu bạn đang chạy trên máy tính của mình, hãy thay đổi localhost:3001 thành localhost:3000.
const BASE_URL = "http://localhost:3001";

export const api = {
  // Lấy tất cả sản phẩm
  getAllProducts: async () => {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
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
};
