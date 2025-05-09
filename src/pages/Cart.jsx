import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Card,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import { Add, Remove, Close } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../store/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const Cart = () => {
  const { items = [], total = 0 } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, updateUserCart } = useAuth();

  // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
    }
  }, [user, navigate]);

  // Thêm kiểm tra dữ liệu
  useEffect(() => {
    console.log("Cart items:", items);
    // Kiểm tra xem items có đúng cấu trúc không
    if (items && items.length > 0) {
      items.forEach((item, index) => {
        if (!item.price && item.price !== 0) {
          console.warn(`Item at index ${index} has no price:`, item);
        }
      });
    }
  }, [items]);

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));

    // Cập nhật giỏ hàng trong database nếu user đã đăng nhập
    if (user) {
      const updatedItems = items.filter((item) => item.id !== id);
      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      updateUserCart({
        items: updatedItems,
        total: updatedTotal,
      });
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));

      // Cập nhật giỏ hàng trong database nếu user đã đăng nhập
      if (user) {
        const updatedItems = items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
        const updatedTotal = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        updateUserCart({
          items: updatedItems,
          total: updatedTotal,
        });
      }
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());

    // Cập nhật giỏ hàng trong database nếu user đã đăng nhập
    if (user) {
      updateUserCart({
        items: [],
        total: 0,
      });
    }
  };

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: "80px", py: 4, minHeight: "60vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Vui lòng đăng nhập để xem giỏ hàng của bạn!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login", { state: { from: "/cart" } })}
            sx={{ mt: 2 }}
          >
            Đăng nhập
          </Button>
        </Box>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Box
        sx={{
          mt: "64px",
          minHeight: "calc(100vh - 64px)",
          bgcolor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          maxWidth: "100vw",
          px: 4,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          Giỏ hàng của bạn đang trống
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/products"
          sx={{ mt: 2 }}
        >
          Tiếp tục mua sắm
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: "64px",
        minHeight: "calc(100vh - 64px)",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        maxWidth: "100vw",
        px: 4,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500, mt: 3 }}>
        Order Summary :
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        {items.map((item) => (
          <Card
            key={item.id}
            sx={{
              display: "flex",
              p: 2,
              position: "relative",
              bgcolor: "#e6e6e6",
              boxShadow: "none",
              borderRadius: 1,
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
              <CardMedia
                component="img"
                sx={{
                  width: 180,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
                image={item.image}
                alt={item.name}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 500, fontSize: "1.1rem" }}
                  >
                    {item.name}
                  </Typography>
                  {item.color && (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                      Color: {item.color}
                    </Typography>
                  )}
                  {item.dimension && (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                      Size: {item.dimension}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(item.id, item.quantity - 1);
                    }}
                    sx={{
                      bgcolor: "black",
                      color: "white",
                      "&:hover": { bgcolor: "black" },
                    }}
                  >
                    <Remove />
                  </IconButton>
                  <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(item.id, item.quantity + 1);
                    }}
                    sx={{
                      bgcolor: "black",
                      color: "white",
                      "&:hover": { bgcolor: "black" },
                    }}
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  minWidth: 100,
                  position: "relative",
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromCart(item.id);
                  }}
                  sx={{ position: "absolute", top: -8, right: -8 }}
                >
                  <Close />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{
                    mt: "auto",
                    fontWeight: 500,
                  }}
                >
                  {(item.price || 0).toFixed(2)}VND
                </Typography>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          mb: 2,
        }}
      >
        <Button variant="outlined" color="error" onClick={handleClearCart}>
          Clear Cart
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Total: {total.toFixed(2)}VND
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
        <Button
          variant="contained"
          component={Link}
          to="/checkout"
          sx={{
            bgcolor: "black",
            color: "white",
            "&:hover": { bgcolor: "black" },
            py: 1.5,
            px: 4,
          }}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
