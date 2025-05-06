import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCartWithNotification } from "../store/cartSlice";
import {
  addToWishlistWithNotification,
  removeFromWishlist,
} from "../store/wishlistSlice";
import { api } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Favorite, ShoppingCart } from "@mui/icons-material";

const categories = ["Deskframe", "Desktop", "L-Shaped", "Desk for kids"];
const colors = ["Black", "White", "Grey"];
const dimensions = ["140x80", "160x80", "180x80"];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("Desktop");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();
    const isInWishlist = wishlistItems.some((item) => item.id === product.id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlistWithNotification(product));
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProductsByCategory(selectedCategory);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
        mt: "64px", // Add margin top for fixed navbar
        position: "relative",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          p: 3,
          bgcolor: "#e0e0e0",
          position: "fixed",
          top: 64,
          left: 0,
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          zIndex: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Featured
        </Typography>
        <Typography
          variant="body2"
          color="primary"
          sx={{ mb: 2, cursor: "pointer" }}
        >
          View All
        </Typography>

        <Typography variant="h6" gutterBottom>
          Popular
        </Typography>
        <List>
          {[
            "Bestsellers",
            "Deskframe",
            "Desktop",
            "L-Shaped",
            "Desk for kids",
          ].map((text) => (
            <ListItem key={text} sx={{ py: 0 }}>
              <ListItemText
                primary={text}
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Colors
        </Typography>
        <List>
          {colors.map((color) => (
            <ListItem key={color} sx={{ py: 0 }}>
              <ListItemText
                primary={color}
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Dimensions
        </Typography>
        <List>
          {dimensions.map((dimension) => (
            <ListItem key={dimension} sx={{ py: 0 }}>
              <ListItemText
                primary={dimension}
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          marginLeft: "240px",
          maxWidth: "calc(100% - 240px)",
          overflowX: "hidden",
        }}
      >
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? "primary" : "default"}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate(`/products/${product.id}`)}
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
                <Box
                  sx={{
                    position: "relative",
                    paddingTop: "75%",
                    width: "100%",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {product.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" color="primary" component="span">
                        {(product.price || product.basePrice).toLocaleString(
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
                    <Box>
                      <IconButton
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={(e) => handleToggleWishlist(e, product)}
                      >
                        <Favorite
                          color={
                            wishlistItems.some((item) => item.id === product.id)
                              ? "error"
                              : "inherit"
                          }
                        />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => dispatch(addToCart(product))}
                      >
                        <ShoppingCart />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Products;
