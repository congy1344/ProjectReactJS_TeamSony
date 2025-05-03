import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  IconButton,
  Chip,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { Favorite, ShoppingCart, ArrowBack } from "@mui/icons-material";
import { api } from "../api/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.getProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch product details. Please try again later.");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  if (error || !product) {
    return (
      <Container sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/products")}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>
        <Typography color="error" sx={{ textAlign: "center" }}>
          {error || "Product not found"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 4,
        px: 3,
        mt: "64px",
        width: "100vw",
        maxWidth: "100vw !important",
        height: "calc(100vh - 64px)",
        overflowY: "auto",
      }}
    >
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/products")}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ position: "relative" }}>
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
              height="500"
              image={product.image}
              alt={product.name}
              sx={{ objectFit: "cover" }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" color="primary" component="span">
              {product.price.toLocaleString("vi-VN")}₫
            </Typography>
            {product.originalPrice && (
              <Typography
                variant="h6"
                color="text.secondary"
                component="span"
                sx={{ textDecoration: "line-through", ml: 2 }}
              >
                {product.originalPrice.toLocaleString("vi-VN")}₫
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Category: {product.category}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={() => dispatch(addToCart(product))}
            >
              Add to Cart
            </Button>
            <IconButton size="large" sx={{ border: 1, borderColor: "divider" }}>
              <Favorite />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
