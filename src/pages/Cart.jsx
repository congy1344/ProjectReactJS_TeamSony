import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Card,
  CardMedia,
  Paper,
} from "@mui/material";
import {
  Add,
  Remove,
  Close,
  ShoppingCart,
  ArrowBack,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Cart = () => {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user, updateUserCart } = useAuth();
  const navigate = useNavigate();

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

  return (
    <Box
      sx={{
        mt: "64px",
        minHeight: "calc(100vh - 64px)",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        px: { xs: 2, md: 4 },
        py: 3,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
        Order Summary :
      </Typography>

      {items.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
            px: 3,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxWidth: 600,
            mx: "auto",
            textAlign: "center",
          }}
        >
          <ShoppingCart sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Giỏ hàng của bạn đang trống
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Hãy thêm sản phẩm vào giỏ hàng để tiến hành đặt hàng
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "black",
              color: "white",
              px: 3,
              py: 1,
              "&:hover": {
                bgcolor: "#333",
              },
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </Box>
      ) : (
        <>
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
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                    image={item.image}
                    alt={item.name}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Color : {item.color || "Black"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dimension : {item.dimension || "160x80"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
                      {item.price.toLocaleString("vi-VN")}₫
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Tổng tiền */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 1,
              bgcolor: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="body1">Tạm tính:</Typography>
              <Typography variant="body1">
                {total.toLocaleString("vi-VN")}₫
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="body1">Phí vận chuyển:</Typography>
              <Typography variant="body1">Miễn phí</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #eee",
                pt: 2,
              }}
            >
              <Typography variant="h6">Tổng cộng:</Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {total.toLocaleString("vi-VN")}₫
              </Typography>
            </Box>
          </Paper>

          <Box
            sx={{
              mt: 4,
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/")}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "text.primary",
                },
              }}
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "black",
                color: "white",
                px: 4,
                py: 1.5,
                "&:hover": {
                  bgcolor: "black",
                },
              }}
              onClick={() => navigate("/checkout")}
            >
              Thanh toán
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;
