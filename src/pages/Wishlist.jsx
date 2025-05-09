import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { removeFromWishlist } from "../store/wishlistSlice";
import { addToCartWithNotification } from "../store/cartSlice";
import { Favorite, ShoppingCart, ArrowBack } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";

const Wishlist = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, updateUserWishlist } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug: Log wishlist items
  useEffect(() => {
    console.log("Wishlist items:", wishlistItems);
    console.log("User:", user);
  }, [wishlistItems, user]);

  const handleRemoveFromWishlist = async (id) => {
    try {
      dispatch(removeFromWishlist(id));
      if (user && user.id) {
        const updatedWishlist = {
          items: wishlistItems.filter((item) => item.id !== id),
        };
        updateUserWishlist(updatedWishlist);
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", { state: { from: "/wishlist" } });
      return;
    }

    if (!product || !product.id) {
      console.error("Invalid product data:", product);
      return;
    }

    const productToAdd = {
      ...product,
      quantity: 1,
      price: product.price || product.basePrice || 0,
    };

    dispatch(addToCartWithNotification(productToAdd));
  };

  const handleProductClick = (productId) => {
    if (!productId) {
      console.error("Product ID is undefined");
      return;
    }
    navigate(`/products/${productId}`);
  };

  // Nếu chưa đăng nhập
  if (!user) {
    return (
      <div
        style={{
          marginTop: "64px",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            padding: "24px",
            textAlign: "center",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Vui lòng đăng nhập để xem danh sách yêu thích của bạn!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login", { state: { from: "/wishlist" } })}
            sx={{ mt: 2 }}
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  // Đang loading
  if (loading) {
    return (
      <div
        style={{
          marginTop: "64px",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  // Có lỗi
  if (error) {
    return (
      <div
        style={{
          marginTop: "64px",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            padding: "24px",
            textAlign: "center",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // Wishlist trống
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div
        style={{
          marginTop: "64px",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            padding: "24px",
            textAlign: "center",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Chưa có sản phẩm yêu thích nào!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Khám phá sản phẩm
          </Button>
        </div>
      </div>
    );
  }

  // Hiển thị danh sách wishlist
  return (
    <Box
      sx={{
        mt: "64px", // Margin top for navbar
        minHeight: "calc(100vh - 64px)",
        width: "100%",
        bgcolor: "#f5f5f5",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            m: 0,
          }}
        >
          Danh sách yêu thích ({wishlistItems.length})
        </Typography>
      </Box>

      {wishlistItems.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
            px: 3,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <Favorite sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Danh sách yêu thích của bạn đang trống
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Hãy thêm sản phẩm vào danh sách yêu thích để xem sau
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "black",
              color: "white",
              "&:hover": {
                bgcolor: "#333",
              },
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: "#fff",
            p: 3,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Grid container spacing={3}>
            {wishlistItems.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                    onClick={() => navigate(`/products/${product.id}`)}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="h6" color="primary.main" sx={{ mt: 1 }}>
                      {(product.price || product.basePrice || 0).toLocaleString("vi-VN")}₫
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<ShoppingCart />}
                      onClick={() => dispatch(addToCartWithNotification(product))}
                      sx={{
                        borderColor: "black",
                        color: "black",
                        "&:hover": {
                          borderColor: "black",
                          bgcolor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      Thêm vào giỏ
                    </Button>
                    <IconButton
                      onClick={() => {
                        dispatch(removeFromWishlist(product.id));
                        if (user) {
                          const updatedItems = wishlistItems.filter(
                            (item) => item.id !== product.id
                          );
                          updateUserWishlist(updatedItems);
                        }
                      }}
                      sx={{
                        color: "error.main",
                        "&:hover": {
                          bgcolor: "error.light",
                        },
                      }}
                    >
                      <Favorite />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Wishlist;
