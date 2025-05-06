import { createSlice } from "@reduxjs/toolkit";
import { showNotification } from "./notificationSlice";

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
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setWishlist: (state, action) => {
      // Completely replace the wishlist with the provided data
      state.items = action.payload.items || [];
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, setWishlist, clearWishlist } =
  wishlistSlice.actions;

// Thunk action để thêm vào wishlist và hiển thị thông báo
export const addToWishlistWithNotification = (product) => (dispatch) => {
  dispatch(addToWishlist(product));
  dispatch(
    showNotification({
      message: "Đã thêm sản phẩm vào danh sách yêu thích",
      type: "success",
    })
  );
};

// Thunk action để xóa khỏi wishlist và hiển thị thông báo
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
