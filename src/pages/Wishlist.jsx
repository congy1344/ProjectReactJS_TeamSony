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
    <div
      style={{
        marginTop: "64px",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 500,
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Danh sách yêu thích ({wishlistItems.length})
        </Typography>
        <hr
          style={{
            marginBottom: "24px",
            border: "none",
            borderTop: "1px solid #eee",
          }}
        />

        {wishlistItems.map((product) => (
          <div
            key={product.id}
            style={{
              marginBottom: "16px",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              backgroundColor: "white",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: window.innerWidth < 600 ? "column" : "row",
              }}
            >
              {/* Hình ảnh sản phẩm */}
              <div
                style={{
                  width: window.innerWidth < 600 ? "100%" : "150px",
                  height: window.innerWidth < 600 ? "200px" : "150px",
                  position: "relative",
                  marginBottom: window.innerWidth < 600 ? "16px" : "0",
                }}
                onClick={() => handleProductClick(product.id)}
              >
                <img
                  src={product.image || "https://via.placeholder.com/300"}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
                {product.discount && (
                  <Chip
                    label={`-${product.discount}%`}
                    color="error"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      zIndex: 1,
                    }}
                  />
                )}
              </div>

              {/* Thông tin sản phẩm */}
              <div
                style={{
                  marginLeft: window.innerWidth < 600 ? "0" : "16px",
                  flex: "1",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 500,
                    }}
                    onClick={() => handleProductClick(product.id)}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      marginTop: "8px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {product.description}
                  </Typography>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems:
                      window.innerWidth < 600 ? "flex-start" : "center",
                    marginTop: "16px",
                    flexDirection: window.innerWidth < 600 ? "column" : "row",
                    gap: window.innerWidth < 600 ? "16px" : "0",
                  }}
                >
                  <div>
                    <Typography
                      variant="h6"
                      color="primary"
                      component="span"
                      sx={{ fontWeight: 600, fontSize: "1.1rem" }}
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
                        sx={{
                          textDecoration: "line-through",
                          marginLeft: "8px",
                        }}
                      >
                        {product.originalPrice.toLocaleString("vi-VN")}₫
                      </Typography>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {window.innerWidth >= 600 ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<ShoppingCart />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Thêm vào giỏ
                      </Button>
                    ) : (
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
                    )}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nút tiếp tục mua sắm */}
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate("/")}
        sx={{ marginBottom: "32px" }}
      >
        Tiếp tục mua sắm
      </Button>
    </div>
  );
};

export default Wishlist;
