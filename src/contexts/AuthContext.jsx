import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCart } from "../store/cartSlice";
import { setWishlist } from "../store/wishlistSlice";
import axios from "axios";
import { api } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.cart) {
        dispatch(setCart(parsedUser.cart));
      }
      if (parsedUser.wishlist) {
        dispatch(setWishlist(parsedUser.wishlist));
      }
    }
  }, [dispatch]);

  const updateUserInDB = async (updatedUser) => {
    try {
      const BASE_URL = api.getBaseUrl();
      await axios.put(`${BASE_URL}/users/${updatedUser.id}`, updatedUser);
    } catch (error) {
      console.error("Error updating user in DB:", error);
    }
  };

  const login = (userData) => {
    const userWithDefaults = {
      ...userData,
      cart: userData.cart || { items: [], total: 0 },
      wishlist: userData.wishlist || { items: [] },
    };
    setUser(userWithDefaults);
    localStorage.setItem("user", JSON.stringify(userWithDefaults));
    if (userWithDefaults.cart) {
      dispatch(setCart(userWithDefaults.cart));
    }
    if (userWithDefaults.wishlist) {
      dispatch(setWishlist(userWithDefaults.wishlist));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    dispatch(setCart({ items: [], total: 0 }));
    dispatch(setWishlist({ items: [] }));
  };

  const updateUserCart = (cart) => {
    if (user) {
      const updatedUser = {
        ...user,
        cart,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      updateUserInDB(updatedUser);
    }
  };

  const updateUserWishlist = (wishlist) => {
    if (user) {
      const updatedUser = {
        ...user,
        wishlist,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      updateUserInDB(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUserCart,
        updateUserWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
