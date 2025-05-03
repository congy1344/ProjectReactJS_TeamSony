import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Favorite, ShoppingCart } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { api } from "../api/api";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";

const categories = ["Deskframe", "Desktop", "L-Shaped", "Desk for kids"];
const colors = ["Black", "White", "Grey"];
const dimensions = ["140x80", "160x80", "180x80"];

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Desktop");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [wishlistItems, setWishlistItems] = useState([]);

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

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await api.getWishlist();
        setWishlistItems(data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();
    const isInWishlist = wishlistItems.some((item) => item.id === product.id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

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
        minHeight: "100vh",
        mt: "64px",
        position: "relative",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          bgcolor: "#e0e0e0",
          flexShrink: 0,
          position: "fixed",
          top: 64,
          left: 0,
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          zIndex: 2,
        }}
      >
        <Box sx={{ p: 3 }}>
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
                  onClick={() => setSelectedCategory(text)}
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
      </Box>

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: "calc(100% - 240px)",
          marginLeft: "240px",
          overflowX: "hidden",
        }}
      >
        {/* Categories header */}
        <Box
          sx={{
            position: "fixed",
            top: 64,
            left: 240,
            right: 0,
            zIndex: 1,
            py: 2,
            px: 3,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "white",
            display: "flex",
            gap: 2,
            overflowX: "auto",
          }}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? "primary" : "default"}
              sx={{
                borderRadius: 1,
                minWidth: "fit-content",
                px: 2,
              }}
            />
          ))}
        </Box>

        {/* Products grid */}
        <Box sx={{ p: 3, flex: 1, bgcolor: "#f5f5f5", mt: "56px" }}>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
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
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{ cursor: "pointer", mb: 1 }}
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, flexGrow: 1 }}
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
                        >
                          {product.price.toLocaleString("vi-VN")}₫
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={(e) => handleToggleWishlist(e, product)}
                        >
                          <Favorite
                            color={
                              wishlistItems.some(
                                (item) => item.id === product.id
                              )
                                ? "error"
                                : "inherit"
                            }
                          />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleAddToCart(e, product)}
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
    </Box>
  );
};

export default Home;
