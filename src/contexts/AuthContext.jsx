import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWishlist, clearWishlist } from "../store/wishlistSlice";
import { setCart, clearCart } from "../store/cartSlice";
import axios from "axios";
import { api } from "../api/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Kiểm tra xem có user trong localStorage không
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Đồng bộ wishlist từ user vào Redux store
      if (userData.wishlist && userData.wishlist.items) {
        dispatch(setWishlist(userData.wishlist));
      }

      // Đồng bộ cart từ user vào Redux store
      if (userData.cart && userData.cart.items) {
        dispatch(setCart(userData.cart));
      }
    }
    setLoading(false);
  }, [dispatch]);

  const login = async (userData) => {
    console.log("Login with user data:", userData);

    // Lưu user vào state và localStorage
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Xóa wishlist hiện tại và thay thế bằng wishlist của user
    if (userData.wishlist && userData.wishlist.items) {
      dispatch(setWishlist(userData.wishlist));
    } else {
      // Nếu user không có wishlist, tạo một wishlist trống
      dispatch(setWishlist({ items: [] }));
    }

    // Xóa giỏ hàng hiện tại và thay thế bằng giỏ hàng của user
    if (userData.cart && userData.cart.items) {
      dispatch(setCart(userData.cart));
    } else {
      // Nếu user không có giỏ hàng, tạo một giỏ hàng trống
      dispatch(setCart({ items: [], total: 0 }));
    }
  };

  const logout = async () => {
    if (user) {
      try {
        const BASE_URL = api.getBaseUrl();
        await axios.patch(`${BASE_URL}/users/${user.id}`, {
          cart: { items: [], total: 0 },
        });
      } catch (error) {
        console.error("Error clearing user cart in database on logout:", error);
      }
    }
    setUser(null);
    localStorage.removeItem("user");

    // Xóa wishlist khi đăng xuất
    dispatch(clearWishlist());
    localStorage.removeItem("wishlist");

    // Xóa giỏ hàng khi đăng xuất
    dispatch(clearCart());
    localStorage.removeItem("cart");
  };

  const isAdmin = () => {
    console.log("Checking isAdmin, user:", user);
    return user && user.role === "admin";
  };

  const updateUserCart = async (cart) => {
    if (user) {
      const updatedUser = { ...user, cart };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Cập nhật giỏ hàng của user trong database
      try {
        const BASE_URL = api.getBaseUrl();
        await axios.patch(`${BASE_URL}/users/${user.id}`, {
          cart: cart,
        });
      } catch (error) {
        console.error("Error updating user cart in database:", error);
      }
    }
  };

  const updateUserWishlist = async (wishlist) => {
    if (user) {
      const updatedUser = { ...user, wishlist };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Đồng bộ wishlist vào Redux store
      dispatch(setWishlist(wishlist));

      // Cập nhật wishlist của user trong database
      try {
        const BASE_URL = api.getBaseUrl();
        await axios.patch(`${BASE_URL}/users/${user.id}`, {
          wishlist: wishlist,
        });
      } catch (error) {
        console.error("Error updating user wishlist in database:", error);
      }
    }
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    loading,
    updateUserCart,
    updateUserWishlist,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
