import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store/store";
import { setWishlist } from "./store/wishlistSlice";
import Navbar from "./components/Navbar";
import AdminFAB from "./components/AdminFAB";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountSetting from "./pages/AccountSetting";
import Notification from "./components/Notification";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import OrderPage from "./pages/OrderPage";
import Wishlist from "./pages/Wishlist"; // Import trang Wishlist
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import UserManagement from "./pages/admin/UserManagement";

import "./index.css";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#1a1a1a",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

// Sửa lại component ProtectedAdminRoute
function ProtectedAdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Thêm console.log để debug
    console.log("ProtectedAdminRoute - User:", user);
    console.log("ProtectedAdminRoute - isAdmin:", isAdmin());

    if (!user) {
      console.log("No user, redirecting to login");
      navigate("/login");
      return;
    }

    if (!isAdmin()) {
      console.log("Not admin, redirecting to home");
      navigate("/");
      return;
    }
  }, [user, isAdmin, navigate]);

  return children;
}

// Component để tải dữ liệu ban đầu
function DataLoader() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    // Tải wishlist từ localStorage nếu có
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      try {
        const parsedWishlist = JSON.parse(storedWishlist);
        dispatch(setWishlist(parsedWishlist));
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error);
      }
    }
  }, [dispatch]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Provider>
  );
}

// Tách nội dung App ra để có thể sử dụng hooks
function AppContent() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  // Tải wishlist từ user nếu đã đăng nhập
  useEffect(() => {
    if (user && user.wishlist && user.wishlist.items) {
      dispatch(setWishlist(user.wishlist));
    }
  }, [user, dispatch]);

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            width: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Navbar />
          <Notification />
          <DataLoader />
          <Box
            component="main"
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              position: "relative",
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account-setting" element={<AccountSetting />} />
              <Route path="/orders" element={<OrderPage />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* Admin Routes */}
              <Route
                path="/admin/products"
                element={
                  <ProtectedAdminRoute>
                    <ProductManagement />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedAdminRoute>
                    <OrderManagement />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedAdminRoute>
                    <UserManagement />
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
            <AdminFAB />
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
