import axios from "axios";

const API_URL = "http://localhost:3001";

export const api = {
  // Lấy tất cả sản phẩm
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Lấy sản phẩm nổi bật
  getFeaturedProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/featured_products`);
      return response.data;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (category) => {
    try {
      const response = await axios.get(
        `${API_URL}/products?category=${category}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      throw error;
    }
  },
};