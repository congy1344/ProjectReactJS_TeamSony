import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  CardMedia,
  Paper,
  Divider,
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
    <Container
      maxWidth={false}
      sx={{
        mt: { xs: "56px", sm: "64px" },
        minHeight: "calc(100vh - 64px)",
        width: "100vw",
        bgcolor: "#f5f5f5",
        p: { xs: 2, sm: 3 },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            m: 0,
          }}
        >
          Giỏ hàng ({items.length})
        </Typography>
      </Box>

      {items.length === 0 ? (
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
            px: 3,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
            width: "100%",
            maxWidth: "600px",
            mx: "auto",
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
              "&:hover": {
                bgcolor: "#333",
              },
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "4fr 1fr" },
            gap: 3,
            width: "100%",
            alignItems: "start",
          }}
        >
          {/* Cart Items Section */}
          <Paper
            sx={{
              borderRadius: 1,
              overflow: "hidden",
              width: "100%",
              p: 3,
            }}
          >
            {items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 3,
                  p: 2,
                  borderBottom: "1px solid #eee",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: { xs: 100, sm: 150 },
                    height: { xs: 100, sm: 150 },
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                  image={item.image}
                  alt={item.name}
                />

                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontSize: "1.2rem" }}>
                      {item.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromCart(item.id);
                      }}
                      sx={{
                        color: "error.main",
                        "&:hover": {
                          bgcolor: "error.light",
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Màu sắc: {item.color || "Black"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Kích thước: {item.dimension || "160x80"}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(item.id, item.quantity - 1);
                        }}
                        sx={{
                          border: "1px solid #ddd",
                          borderRadius: 1,
                        }}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography
                        sx={{
                          mx: 1,
                          minWidth: 30,
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(item.id, item.quantity + 1);
                        }}
                        sx={{
                          border: "1px solid #ddd",
                          borderRadius: 1,
                        }}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {(item.price || item.basePrice || 0).toLocaleString("vi-VN")}₫
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>

          {/* Order Summary Section */}
          <Paper
            sx={{
              borderRadius: 1,
              width: "100%",
              maxWidth: { md: "300px" },
              alignSelf: "start",
              p: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Tổng đơn hàng
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography>Tạm tính:</Typography>
              <Typography>{(total || 0).toLocaleString("vi-VN")}₫</Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography>Phí vận chuyển:</Typography>
              <Typography>Miễn phí</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography sx={{ fontWeight: 600 }}>Tổng cộng:</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {(total || 0).toLocaleString("vi-VN")}₫
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate("/")}
                sx={{
                  borderColor: "#ddd",
                  color: "text.primary",
                }}
              >
                TIẾP TỤC MUA SẮM
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/checkout")}
                sx={{
                  bgcolor: "black",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#333",
                  },
                }}
              >
                THANH TOÁN
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Cart; 