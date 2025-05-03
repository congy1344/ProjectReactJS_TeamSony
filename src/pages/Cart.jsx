import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Card,
  CardMedia,
} from "@mui/material";
import { Add, Remove, Close } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Cart = () => {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user, updateUserCart } = useAuth();

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
        width: "100vw",
        maxWidth: "100vw",
        px: 4,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500, mt: 3 }}>
        Order Summary :
      </Typography>

      {items.length === 0 ? (
        <Typography>Your cart is empty</Typography>
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
                      width: 180,
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
                      {item.price.toFixed(2)}€
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

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
              component={Link}
              to="/"
              sx={{
                color: "text.secondary",
                textDecoration: "underline",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              ← Continue Shopping
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
              component={Link}
              to="/checkout"
            >
              Proceed to checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;
