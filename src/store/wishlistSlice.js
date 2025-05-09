import { createSlice } from "@reduxjs/toolkit";
import { showNotification } from "./notificationSlice";

// Helper function to save wishlist to localStorage
const saveWishlistToLocalStorage = (wishlist) => {
  try {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  } catch (error) {
    console.error("Error saving wishlist to localStorage:", error);
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
    addToWishlist: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        // Đảm bảo sản phẩm có đầy đủ thông tin trước khi thêm vào wishlist
        const productToAdd = {
          ...action.payload,
          // Đảm bảo các trường quan trọng luôn tồn tại
          price: action.payload.price || action.payload.basePrice || 0,
          image: action.payload.image || "https://via.placeholder.com/300",
          description: action.payload.description || "",
        };
        state.items.push(productToAdd);
        // Save to localStorage after adding
        saveWishlistToLocalStorage({ items: state.items });
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // Save to localStorage after removing
      saveWishlistToLocalStorage({ items: state.items });
    },
    setWishlist: (state, action) => {
      // Completely replace the wishlist with the provided data
      state.items = action.payload.items || [];
      // Save to localStorage after setting
      saveWishlistToLocalStorage({ items: state.items });
    },
    clearWishlist: (state) => {
      state.items = [];
      // Save to localStorage after clearing
      saveWishlistToLocalStorage({ items: [] });
    },
  },
});

export const { addToWishlist, removeFromWishlist, setWishlist, clearWishlist } =
  wishlistSlice.actions;

// Thunk action to add to wishlist and show notification
export const addToWishlistWithNotification = (product) => (dispatch) => {
  dispatch(addToWishlist(product));
  dispatch(
    showNotification({
      message: "Đã thêm sản phẩm vào danh sách yêu thích",
      type: "success",
    })
  );
};

// Thunk action to remove from wishlist and show notification
export const removeFromWishlistWithNotification = (productId) => (dispatch) => {
  dispatch(removeFromWishlist(productId));
  dispatch(
    showNotification({
      message: "Đã xóa sản phẩm khỏi danh sách yêu thích",
      type: "info",
    })
  );
};

export default wishlistSlice.reducer;
