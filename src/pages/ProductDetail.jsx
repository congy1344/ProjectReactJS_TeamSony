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
  Rating,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addToCartWithNotification } from "../store/cartSlice";
import {
  addToWishlistWithNotification,
  removeFromWishlist,
} from "../store/wishlistSlice";
import {
  Favorite,
  ShoppingCart,
  ArrowBack,
  Add,
  Remove,
} from "@mui/icons-material";
import { api } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

// Hàm chuyển đổi tên màu thành mã màu CSS
const getColorCode = (colorName) => {
  const colorMap = {
    Black: "#000000",
    White: "#FFFFFF",
    Grey: "#808080",
    Red: "#FF0000",
    Blue: "#0000FF",
    Green: "#008000",
    Yellow: "#FFFF00",
    Pink: "#FFC0CB",
    Purple: "#800080",
    Brown: "#A52A2A",
    Orange: "#FFA500",
    Silver: "#C0C0C0",
    Natural: "#E8D8C0",
    Rainbow:
      "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
  };

  return colorMap[colorName] || "#CCCCCC"; // Màu mặc định nếu không tìm thấy
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedDimension, setSelectedDimension] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Thêm state cho giá
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.getProductById(id);
        setProduct(data);

        // Set giá trị mặc định cho color và dimension
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }

        if (data.dimensions && data.dimensions.length > 0) {
          setSelectedDimension(data.dimensions[0]);
        }

        // Thiết lập giá ban đầu
        setCurrentPrice(data.price || data.basePrice || 0);

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

  const handleColorChange = (event, newColor) => {
    if (newColor !== null) {
      setSelectedColor(newColor);
    }
  };

  const handleDimensionChange = (event, newDimension) => {
    if (newDimension !== null) {
      setSelectedDimension(newDimension);
    }
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCartWithNotification({
        ...product,
        quantity,
        color: selectedColor,
        dimension: selectedDimension,
      })
    );
  };

  const handleBuyNow = () => {
    // Đảm bảo sản phẩm có giá trước khi chuyển đến trang checkout
    const productToCheckout = {
      ...product,
      quantity,
      color: selectedColor,
      dimension: selectedDimension,
      // Đảm bảo sản phẩm có giá
      price: product.price || product.basePrice || 0,
    };

    navigate("/checkout", {
      state: {
        buyNowProduct: productToCheckout,
      },
    });
  };

  const handleToggleWishlist = () => {
    if (user) {
      const isInWishlist = wishlistItems.some((item) => item.id === product.id);
      if (isInWishlist) {
        dispatch(removeFromWishlist(product.id));
        // Cập nhật wishlist trong database nếu cần
      } else {
        dispatch(addToWishlistWithNotification(product));
        // Cập nhật wishlist trong database nếu cần
      }
    } else {
      navigate("/login");
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

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Rating
              value={product.ratings?.average || 0}
              precision={0.5}
              readOnly
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({product.ratings?.count || 0} đánh giá)
            </Typography>
            <Chip
              label={product.inStock ? "Còn hàng" : "Hết hàng"}
              color={product.inStock ? "success" : "error"}
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {product.detailedDescription || product.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              {(product.price || product.basePrice || 0).toLocaleString(
                "vi-VN"
              )}
              ₫
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

          {product.colors && product.colors.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Color
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {product.colors.map((color) => {
                  // Chuyển đổi tên màu thành mã màu CSS
                  const colorCode = getColorCode(color);

                  return (
                    <Box
                      key={color}
                      onClick={() => handleColorChange(null, color)}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: colorCode,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border:
                          selectedColor === color
                            ? "2px solid #000"
                            : "1px solid #ddd",
                        boxShadow:
                          selectedColor === color
                            ? "0 0 5px rgba(0,0,0,0.3)"
                            : "none",
                        position: "relative",
                        "&:hover": {
                          boxShadow: "0 0 8px rgba(0,0,0,0.4)",
                        },
                        "&::after":
                          selectedColor === color
                            ? {
                                content: '""',
                                position: "absolute",
                                width: 30,
                                height: 30,
                                borderRadius: "50%",
                                border: "2px solid white",
                              }
                            : {},
                      }}
                    />
                  );
                })}
              </Box>
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                Selected: {selectedColor || "None"}
              </Typography>
            </Box>
          )}

          {product.dimensions && product.dimensions.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Dimensions
              </Typography>
              <ToggleButtonGroup
                value={selectedDimension}
                exclusive
                onChange={handleDimensionChange}
                aria-label="dimension selection"
              >
                {product.dimensions.map((dimension) => (
                  <ToggleButton
                    key={
                      typeof dimension === "object" ? dimension.size : dimension
                    }
                    value={
                      typeof dimension === "object" ? dimension.size : dimension
                    }
                    aria-label={
                      typeof dimension === "object" ? dimension.size : dimension
                    }
                    sx={{
                      mx: 0.5,
                      textTransform: "none",
                      "&.Mui-selected": {
                        bgcolor: "rgba(0, 0, 0, 0.08)",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    {typeof dimension === "object" ? dimension.size : dimension}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Quantity:
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <Remove fontSize="small" />
            </IconButton>
            <Typography sx={{ mx: 2 }}>{quantity}</Typography>
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(1)}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              sx={{ flex: 1 }}
            >
              Add to Cart
            </Button>
            <IconButton
              size="large"
              sx={{
                border: 1,
                borderColor: "divider",
                color: user?.wishlist?.items?.some(
                  (item) => item.id === product.id
                )
                  ? "error"
                  : "inherit",
              }}
              onClick={handleToggleWishlist}
            >
              <Favorite />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleBuyNow}
            sx={{
              bgcolor: "success.main",
              "&:hover": {
                bgcolor: "success.dark",
              },
            }}
          >
            Buy Now
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
