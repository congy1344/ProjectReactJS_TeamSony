import { createSlice, createAction } from "@reduxjs/toolkit";
import { showNotification } from "./notificationSlice";

// Helper function to save cart to localStorage
const saveCartToLocalStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      // Save to localStorage after adding
      saveCartToLocalStorage({ items: state.items, total: state.total });
      return state;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      // Save to localStorage after removing
      saveCartToLocalStorage({ items: state.items, total: state.total });
      return state;
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      // Save to localStorage after updating
      saveCartToLocalStorage({ items: state.items, total: state.total });
      return state;
    },
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.total = action.payload.total || 0;
      // Save to localStorage after setting
      saveCartToLocalStorage({ items: state.items, total: state.total });
      return state;
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      // Save to localStorage after clearing
      saveCartToLocalStorage({ items: [], total: 0 });
      return state;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setCart, clearCart } =
  cartSlice.actions;

// Thunk action để thêm vào giỏ hàng và hiển thị thông báo
export const addToCartWithNotification = (product) => (dispatch, getState) => {
  dispatch(addToCart(product));
  dispatch(
    showNotification({
      message: "Đã thêm sản phẩm vào giỏ hàng",
      type: "success",
    })
  );
};

export default cartSlice.reducer;
