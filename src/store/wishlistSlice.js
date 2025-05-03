import { createSlice } from "@reduxjs/toolkit";
import { showNotification } from "./notificationSlice";

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        state.items.push(action.payload);
      }
      return state;
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      return state;
    },
    setWishlist: (state, action) => {
      state.items = action.payload.items || [];
      return state;
    },
  },
});

export const { addToWishlist, removeFromWishlist, setWishlist } =
  wishlistSlice.actions;

// Thunk action để thêm vào wishlist và hiển thị thông báo
export const addToWishlistWithNotification =
  (product) => (dispatch, getState) => {
    dispatch(addToWishlist(product));
    dispatch(
      showNotification({
        message: "Đã thêm sản phẩm vào danh sách yêu thích",
        type: "success",
      })
    );
  };

export default wishlistSlice.reducer;
