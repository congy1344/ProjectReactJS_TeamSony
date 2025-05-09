import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Favorite, ShoppingCart } from "@mui/icons-material";
import { addToCartWithNotification } from "../store/cartSlice";
import {
  addToWishlistWithNotification,
  removeFromWishlist,
} from "../store/wishlistSlice";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api/api"; // Thay đổi từ import * as api thành import { api }
import Footer from "../components/Footer";

const categories = ["Deskframe", "Desktop", "L-Shaped", "Desk for kids"];
const colors = ["Black", "White", "Grey"];
const dimensions = ["140x80", "160x80", "180x80"];

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null); // Mặc định là null để hiển thị tất cả
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedDimension, setSelectedDimension] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const cartItems = useSelector((state) => state.cart.items);
  const { user, updateUserCart, updateUserWishlist } = useAuth();

  // Thêm state cho bestsellers
  const [bestsellers, setBestsellers] = useState([]);
  const [loadingBestsellers, setLoadingBestsellers] = useState(true);

  // Thêm state để kiểm soát hiển thị các phần
  const [showBestsellers, setShowBestsellers] = useState(true);
  const [showAllProducts, setShowAllProducts] = useState(true);

  // Xử lý khi chọn danh mục
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Khi chọn danh mục, reset các bộ lọc khác
    setSelectedColor(null);
    setSelectedDimension(null);
    // Cuộn lên đầu trang
    window.scrollTo(0, 0);
  };

  // Xử lý khi chọn All Products
  const handleAllProducts = () => {
    setSelectedCategory(null);
    setSelectedColor(null);
    setSelectedDimension(null);
    // Hiển thị cả hai phần
    setShowBestsellers(true);
    setShowAllProducts(true);
    // Cuộn lên đầu trang
    window.scrollTo(0, 0);
  };

  // Xử lý lọc màu sắc
  const handleColorFilter = (color) => {
    setSelectedColor(selectedColor === color ? null : color);
  };

  // Xử lý lọc kích thước
  const handleDimensionFilter = (dimension) => {
    setSelectedDimension(selectedDimension === dimension ? null : dimension);
  };

  // Fetch tất cả sản phẩm khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getAllProducts();
        setProducts(data);
        setFilteredProducts(data); // Hiển thị tất cả sản phẩm ban đầu
        setError(null);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch sản phẩm theo danh mục khi selectedCategory thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;

        if (selectedCategory) {
          data = await api.getProductsByCategory(selectedCategory);
        } else {
          data = await api.getAllProducts();
        }

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
  }, [selectedCategory]); // Chạy lại khi selectedCategory thay đổi (bao gồm cả khi nó được đặt về null)

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

  // Fetch bestsellers khi component mount
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoadingBestsellers(true);
        const data = await api.getBestsellers();
        setBestsellers(data);
      } catch (err) {
        console.error("Error fetching bestsellers:", err);
      } finally {
        setLoadingBestsellers(false);
      }
    };

    fetchBestsellers();
  }, []);

  // Cập nhật useEffect để điều chỉnh hiển thị dựa trên danh mục đã chọn
  useEffect(() => {
    // Khi chọn danh mục Bestsellers, chỉ hiển thị bestsellers
    if (selectedCategory === "Bestsellers") {
      setShowBestsellers(true);
      setShowAllProducts(false);
    }
    // Khi chọn danh mục khác, chỉ hiển thị sản phẩm theo danh mục
    else if (selectedCategory) {
      setShowBestsellers(false);
      setShowAllProducts(true);
    }
    // Khi không chọn danh mục nào, hiển thị cả hai
    else {
      setShowBestsellers(true);
      setShowAllProducts(true);
    }
  }, [selectedCategory]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    // Yêu cầu đăng nhập nếu chưa đăng nhập
    if (!user) {
      navigate("/login", { state: { from: "/" } });
      return;
    }

    dispatch(addToCartWithNotification({ ...product, quantity: 1 }));

    // Cập nhật giỏ hàng trong database
    const updatedItems = [...cartItems, { ...product, quantity: 1 }];
    const updatedTotal = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    updateUserCart({
      items: updatedItems,
      total: updatedTotal,
    });
  };

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();

    // Yêu cầu đăng nhập nếu chưa đăng nhập
    if (!user) {
      navigate("/login", { state: { from: "/" } });
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
              display: "flex",
              alignItems: "center",
              pl: 1,
              position: "relative",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "primary.main",
                pl: 2,
                backgroundColor: "rgba(0,0,0,0.04)",
                borderRadius: "4px",
              },
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
                position: "relative",
                transition: "all 0.3s ease",
                borderLeft:
                  selectedCategory === text
                    ? "3px solid"
                    : "3px solid transparent",
                borderColor:
                  selectedCategory === text ? "primary.main" : "transparent",
                "&:hover": {
                  color: "primary.main",
                  pl: 2,
                  backgroundColor: "rgba(0,0,0,0.04)",
                  borderRadius: "4px",
                  borderLeft: "3px solid",
                  borderColor: "primary.main",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                },
              }}
              onClick={() => handleCategorySelect(text)}
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
              className="color-option"
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
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.15)",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
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
          display: "flex",
          flexDirection: "column",
          maxWidth: "calc(100% - 240px)",
          marginLeft: "240px",
          overflowX: "hidden",
        }}
      >
        {/* Bestsellers Section - Chỉ hiển thị khi showBestsellers = true */}
        {showBestsellers && (
          <Box sx={{ p: 3, bgcolor: "#fff" }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Bestsellers
            </Typography>

            {loadingBestsellers ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {bestsellers.slice(0, 4).map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product.id}>
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
                      <CardMedia
                        component="img"
                        height="200"
                        image={
                          product.image || "https://via.placeholder.com/300"
                        }
                        alt={product.name}
                        sx={{
                          objectFit: "cover",
                          height: "200px", // Cố định chiều cao
                          width: "100%", // Cố định chiều rộng
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" noWrap>
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
                          }}
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
                              {(
                                product.price || product.basePrice
                              ).toLocaleString("vi-VN")}
                              ₫
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
            )}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedCategory("Bestsellers");
                  window.scrollTo(0, 0);
                }}
              >
                View All Bestsellers
              </Button>
            </Box>
          </Box>
        )}

        {/* Products grid - Chỉ hiển thị khi showAllProducts = true */}
        {showAllProducts && (
          <Box
            sx={{
              p: 3,
              flex: 1,
              bgcolor: "#f5f5f5",
              mt: showBestsellers ? 3 : 0,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              {selectedCategory || "All Products"}
            </Typography>

            <Grid container spacing={3}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
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
                              {(
                                product.price || product.basePrice
                              ).toLocaleString("vi-VN")}
                              ₫
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
                ))
              ) : (
                <Box sx={{ width: "100%", textAlign: "center", py: 5 }}>
                  <Typography variant="h6" color="text.secondary">
                    No products match your filters
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedColor(null);
                      setSelectedDimension(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              )}
            </Grid>
          </Box>
        )}
        <Footer />
      </Box>
    </Box>
  );
};

export default Home;
