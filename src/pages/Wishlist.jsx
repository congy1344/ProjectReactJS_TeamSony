import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Button,
  Container,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Favorite, ShoppingCart } from "@mui/icons-material";
import { addToCartWithNotification } from "../store/cartSlice";
import { removeFromWishlist } from "../store/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Wishlist = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, updateUserWishlist } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRemoveFromWishlist = async (id) => {
    try {
      // Remove from Redux store
      dispatch(removeFromWishlist(id));

      // If user is logged in, update the backend
      if (user && user.id) {
        // Update user's wishlist in the context
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
    // Yêu cầu đăng nhập nếu chưa đăng nhập
    if (!user) {
      navigate("/login", { state: { from: "/wishlist" } });
      return;
    }

    dispatch(addToCartWithNotification({ ...product, quantity: 1 }));

    // Cập nhật giỏ hàng trong user context nếu cần
    if (user && user.updateUserCart) {
      const cartItems = user.cart?.items || [];
      const updatedItems = [...cartItems, { ...product, quantity: 1 }];
      const updatedTotal = updatedItems.reduce(
        (sum, item) =>
          sum + (item.price || item.basePrice || 0) * item.quantity,
        0
      );

      user.updateUserCart({
        items: updatedItems,
        total: updatedTotal,
      });
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: "80px", py: 4, minHeight: "60vh" }}>
        <Box sx={{ textAlign: "center" }}>
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
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          mt: "80px",
          py: 4,
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: "80px", py: 4, minHeight: "60vh" }}>
        <Box sx={{ textAlign: "center" }}>
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
        </Box>
      </Container>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: "80px", py: 4, minHeight: "60vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Chưa có sản phẩm yêu thích nào!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/products")}
            sx={{ mt: 2 }}
          >
            Khám phá sản phẩm
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: "80px", py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
        Danh sách yêu thích ({wishlistItems.length})
      </Typography>
      <Grid container spacing={3}>
        {wishlistItems.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card
              sx={{
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 4,
                },
                cursor: "pointer",
              }}
              onClick={() => handleProductClick(product.id)}
            >
              {product.discount && (
                <Chip
                  label={`-${product.discount}%`}
                  color="error"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 1,
                  }}
                />
              )}
              <CardMedia
                component="img"
                height="200"
                image={product.image || "https://via.placeholder.com/300"}
                alt={product.name}
                sx={{
                  objectFit: "cover",
                  height: "200px", // Cố định chiều cao
                  width: "100%", // Cố định chiều rộng
                }}
              />
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  noWrap
                  sx={{ fontSize: "1rem", fontWeight: 500 }}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    mb: 2,
                    height: "40px", // Cố định chiều cao cho phần mô tả
                  }}
                >
                  {product.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: "auto",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      color="primary"
                      component="span"
                      sx={{ fontWeight: 600, fontSize: "1rem" }}
                    >
                      {(product.price || product.basePrice || 0).toLocaleString(
                        "vi-VN"
                      )}
                      ₫
                    </Typography>
                    {product.originalPrice && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                        sx={{ textDecoration: "line-through", ml: 1 }}
                      >
                        {product.originalPrice.toLocaleString("vi-VN")}₫
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      size="small"
                    >
                      <ShoppingCart />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(product.id);
                      }}
                      size="small"
                    >
                      <Favorite />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Wishlist;
