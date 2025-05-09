import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCartWithNotification } from "../store/cartSlice";
import {
  addToWishlistWithNotification,
  removeFromWishlist,
} from "../store/wishlistSlice";
import { api } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
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
  Button, // Thêm Button vào đây
} from "@mui/material";
import { Favorite, ShoppingCart } from "@mui/icons-material";

const categories = ["Deskframe", "Desktop", "L-Shaped", "Desk for kids"];
const colors = ["Black", "White", "Grey"];
const dimensions = ["140x80", "160x80", "180x80"];

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedDimension, setSelectedDimension] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Sửa lại cách lấy wishlistItems từ Redux store
  const wishlistItems = useSelector((state) => state.wishlist.items || []);

  // Xử lý lọc màu sắc
  const handleColorFilter = (color) => {
    setSelectedColor(selectedColor === color ? null : color);
  };

  // Xử lý lọc kích thước
  const handleDimensionFilter = (dimension) => {
    setSelectedDimension(selectedDimension === dimension ? null : dimension);
  };

  // Áp dụng bộ lọc
  useEffect(() => {
    if (!products.length) return;

    let result = [...products];

    if (selectedCategory) {
      result = result.filter(
        (product) =>
          product.category === selectedCategory ||
          product.type === selectedCategory
      );
    }

    if (selectedColor) {
      result = result.filter(
        (product) =>
          product.color === selectedColor ||
          (product.colors && product.colors.includes(selectedColor))
      );
    }

    if (selectedDimension) {
      result = result.filter(
        (product) =>
          product.dimension === selectedDimension ||
          (product.dimensions && product.dimensions.includes(selectedDimension))
      );
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, selectedColor, selectedDimension]);

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();

    // Yêu cầu đăng nhập nếu chưa đăng nhập
    if (!user) {
      navigate("/login", { state: { from: "/products" } });
      return;
    }

    const isInWishlist =
      wishlistItems && wishlistItems.some((item) => item.id === product.id);

    if (isInWishlist) {
      // Xóa khỏi wishlist
      dispatch(removeFromWishlist(product.id));

      // Cập nhật wishlist trong user context
      const updatedItems = wishlistItems.filter(
        (item) => item.id !== product.id
      );
      updateUserWishlist({ items: updatedItems });
    } else {
      // Thêm vào wishlist
      dispatch(addToWishlistWithNotification(product));

      // Cập nhật wishlist trong user context
      const updatedItems = [...wishlistItems, product];
      updateUserWishlist({ items: updatedItems });
    }
  };

  // Xử lý tìm kiếm từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");

    console.log("URL search parameter:", query);

    if (query) {
      setSearchQuery(query);
      // Reset các bộ lọc khác khi tìm kiếm
      setSelectedCategory(null);
      setSelectedColor(null);
      setSelectedDimension(null);
    } else if (!location.search) {
      // Chỉ reset searchQuery khi không có tham số tìm kiếm nào trong URL
      setSearchQuery("");
    }
  }, [location.search]);

  // Fetch sản phẩm dựa trên tìm kiếm
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;

        if (searchQuery && searchQuery.trim() !== "") {
          console.log("Executing search for:", searchQuery);
          // Sử dụng API tìm kiếm khi có searchQuery
          data = await api.searchProducts(searchQuery);
          console.log("Search results received:", data.length, "items");
        } else if (selectedCategory) {
          console.log("Fetching by category:", selectedCategory);
          data = await api.getProductsByCategory(selectedCategory);
        } else {
          console.log("Fetching all products");
          data = await api.getAllProducts();
        }

        if (!isMounted) return;

        setProducts(data);
        setFilteredProducts(data);

        // Áp dụng bộ lọc màu và kích thước nếu có
        if (selectedColor || selectedDimension) {
          let filtered = [...data];

          if (selectedColor) {
            filtered = filtered.filter(
              (product) =>
                product.color === selectedColor ||
                (product.colors && product.colors.includes(selectedColor))
            );
          }

          if (selectedDimension) {
            filtered = filtered.filter(
              (product) =>
                product.dimension === selectedDimension ||
                (product.dimensions &&
                  (Array.isArray(product.dimensions)
                    ? product.dimensions.includes(selectedDimension)
                    : product.dimensions.some(
                        (d) => d.size === selectedDimension
                      )))
            );
          }

          setFilteredProducts(filtered);
        }

        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory, selectedColor, selectedDimension]);

  // Sửa lại hàm xử lý khi nhấn vào All Products
  const handleAllProducts = () => {
    setSelectedCategory(null);
    setSelectedColor(null);
    setSelectedDimension(null);
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
          bgcolor: "#f8f8f8",
          position: "fixed",
          top: 64,
          left: 0,
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          zIndex: 1,
          boxShadow: "1px 0 5px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            borderBottom: "2px solid #1a1a1a",
            pb: 1,
            mb: 2,
          }}
        >
          Categories
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              cursor: "pointer",
              fontWeight: selectedCategory === null ? 600 : 400,
              color:
                selectedCategory === null ? "primary.main" : "text.primary",
              "&:hover": { color: "primary.main" },
              display: "flex",
              alignItems: "center",
              pl: 1,
            }}
            onClick={handleAllProducts}
          >
            All Products
          </Typography>

          {[
            "Bestsellers",
            "Deskframe",
            "Desktop",
            "L-Shaped",
            "Desk for kids",
          ].map((text) => (
            <Typography
              key={text}
              variant="body1"
              sx={{
                py: 0.5,
                pl: 1,
                cursor: "pointer",
                fontWeight: selectedCategory === text ? 600 : 400,
                color:
                  selectedCategory === text ? "primary.main" : "text.primary",
                "&:hover": { color: "primary.main" },
                borderLeft:
                  selectedCategory === text
                    ? "3px solid"
                    : "3px solid transparent",
                borderColor:
                  selectedCategory === text ? "primary.main" : "transparent",
                transition: "all 0.2s ease",
              }}
              onClick={() => setSelectedCategory(text)}
            >
              {text}
            </Typography>
          ))}
        </Box>

        {/* Color filter */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            borderBottom: "2px solid #1a1a1a",
            pb: 1,
            mb: 2,
            mt: 4,
          }}
        >
          Colors
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 4, pl: 1 }}>
          {colors.map((color) => (
            <Box
              key={color}
              onClick={() => handleColorFilter(color)}
              sx={{
                width: 36,
                height: 36,
                bgcolor: color.toLowerCase(),
                border: "1px solid #ddd",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  selectedColor === color ? "0 0 0 2px #1a1a1a" : "none",
                position: "relative",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
                "&::after":
                  selectedColor === color
                    ? {
                        content: '""',
                        position: "absolute",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                      }
                    : {},
              }}
            />
          ))}
        </Box>

        {/* Dimensions filter */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            borderBottom: "2px solid #1a1a1a",
            pb: 1,
            mb: 2,
          }}
        >
          Dimensions
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, pl: 1 }}>
          {dimensions.map((dimension) => (
            <Chip
              key={dimension}
              label={dimension}
              onClick={() => handleDimensionFilter(dimension)}
              variant={selectedDimension === dimension ? "filled" : "outlined"}
              color={selectedDimension === dimension ? "primary" : "default"}
              sx={{
                mb: 0.5,
                borderRadius: "4px",
                fontWeight: selectedDimension === dimension ? 600 : 400,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor:
                    selectedDimension === dimension ? "" : "rgba(0,0,0,0.04)",
                },
              }}
            />
          ))}
        </Box>
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
        {searchQuery && (
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Search results for: "{searchQuery}"
            <Button
              variant="outlined"
              size="small"
              sx={{ ml: 2 }}
              onClick={() => {
                // Xóa tham số tìm kiếm khỏi URL và quay lại trang products
                navigate("/products");
                setSearchQuery("");
              }}
            >
              Clear Search
            </Button>
          </Typography>
        )}

        <Grid container spacing={3}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
                  {/* Thay đổi cách hiển thị ảnh để đảm bảo tỷ lệ nhất quán */}
                  <Box
                    sx={{
                      position: "relative",
                      paddingTop: "75%", // Tỷ lệ khung hình 4:3
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product.image || "https://via.placeholder.com/300"}
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
                        <Typography
                          variant="h6"
                          color="primary"
                          component="span"
                        >
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
                              wishlistItems &&
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
                          onClick={() => dispatch(addToCart(product))}
                        >
                          <ShoppingCart />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Box sx={{ width: "100%", textAlign: "center", py: 5 }}>
              <Typography variant="h6" color="text.secondary">
                {searchQuery
                  ? `No products found matching "${searchQuery}"`
                  : "No products match your filters"}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedColor(null);
                  setSelectedDimension(null);
                  setSearchQuery("");
                  navigate("/products");
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Products;
