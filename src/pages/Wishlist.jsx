import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
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
} from "@mui/material";
import { Favorite, ShoppingCart } from "@mui/icons-material";
import { addToCartWithNotification } from "../store/cartSlice";
import { removeFromWishlist, setWishlist } from "../store/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Wishlist = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wishlist items directly from API
  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch user data including wishlist
        const response = await axios.get(
          `http://localhost:3001/users/${user.id}`
        );

        if (
          response.data &&
          response.data.wishlist &&
          response.data.wishlist.items
        ) {
          // Dispatch action to update Redux store with fetched wishlist
          dispatch(setWishlist(response.data.wishlist));
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Không thể tải danh sách yêu thích. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, [user, dispatch]);

  const handleRemoveFromWishlist = async (id) => {
    try {
      // Remove from Redux store
      dispatch(removeFromWishlist(id));

      // If user is logged in, update the backend
      if (user && user.id) {
        // Get current wishlist from Redux store after removal
        const updatedWishlist = {
          items: wishlistItems.filter((item) => item.id !== id),
        };

        // Update user's wishlist in the backend
        await axios.patch(`http://localhost:3001/users/${user.id}`, {
          wishlist: updatedWishlist,
        });
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCartWithNotification({ ...product, quantity: 1 }));
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

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
    <Container maxWidth="lg" sx={{ mt: "80px", py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
        Danh sách yêu thích ({wishlistItems.length})
      </Typography>
      <Grid container spacing={3}>
        {wishlistItems.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => handleProductClick(product.id)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    fontWeight: 500,
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                  }}
                  onClick={() => handleProductClick(product.id)}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {product.description && product.description.length > 100
                    ? `${product.description.substring(0, 100)}...`
                    : product.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" color="primary">
                    {(product.price || product.basePrice || 0).toLocaleString(
                      "vi-VN"
                    )}
                    ₫
                  </Typography>
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
