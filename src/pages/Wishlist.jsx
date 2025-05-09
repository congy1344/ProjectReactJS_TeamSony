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

const Wishlist = () => {
  const { items, total } = useSelector((state) => state.wishlist || { items: [], total: 0 }); // Assuming wishlist state
  const dispatch = useDispatch();
  const { user, updateUserWishlist } = useAuth(); // Assuming updateUserWishlist for wishlist
  const navigate = useNavigate();

  const handleRemoveFromWishlist = (id) => {
    dispatch(removeFromCart(id)); // Adjust to wishlist action if different

    if (user) {
      const updatedItems = items.filter((item) => item.id !== id);
      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      updateUserWishlist({
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

        updateUserWishlist({
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
          width: "100%",
          maxWidth: "1200px",
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
          Danh sách yêu thích ({items.length})
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
          }}
        >
          <Typography variant="h5" gutterBottom>
            Chưa có sản phẩm yêu thích nào!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            KHÁM PHÁ SẢN PHẨM
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "black",
              color: "white",
              "&:hover": {
                bgcolor: "#333",
              },
            }}
          >
            KHÁM PHÁ SẢN PHẨM
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr" }, // Single column for all cases
            gap: 3,
            width: "100%",
            maxWidth: "1200px",
            alignItems: "start",
          }}
        >
          {/* Wishlist Items Section */}
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
                  alignItems: "center",
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
                        handleRemoveFromWishlist(item.id);
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
                    Giá: {(item.price || 0).toLocaleString("vi-VN")}₫
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        // Logic to add to cart if needed
                        navigate("/cart");
                      }}
                      sx={{ textTransform: "none" }}
                    >
                      THÊM VÀO GIỎ
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Wishlist;