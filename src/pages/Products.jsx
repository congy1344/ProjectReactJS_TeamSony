import { useState, useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { Favorite, ShoppingCart } from "@mui/icons-material";
import { api } from "../api/api";

const categories = ["Deskframe", "Desktop", "L-Shaped", "Desk for kids"];
const colors = ["Black", "White", "Grey"];
const dimensions = ["140x80", "160x80", "180x80"];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("Desktop");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

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
        width: "100vw",
        mt: "64px", // Add margin top for fixed navbar
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
          width: "calc(100vw - 240px)",
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
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
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
                  height="300"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
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
                        €{product.price}
                      </Typography>
                      {product.originalPrice && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                          sx={{ textDecoration: "line-through", ml: 1 }}
                        >
                          €{product.originalPrice}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <Favorite />
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
