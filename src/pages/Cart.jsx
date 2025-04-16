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

const Cart = () => {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        p: 3,
        mt: "64px",
        width: "100vw",
        maxWidth: "100vw !important",
        height: "calc(100vh - 64px)",
        overflowY: "auto",
        bgcolor: "#f5f5f5",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
        Order Summary :
      </Typography>

      {items.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 180, height: 120, objectFit: "cover" }}
                  image={item.image}
                  alt={item.name}
                />
                <Box sx={{ ml: 2, flex: 1 }}>
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
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
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
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
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
                  }}
                >
                  <IconButton
                    onClick={() => dispatch(removeFromCart(item.id))}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <Close />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                      fontWeight: 500,
                    }}
                  >
                    {item.price.toFixed(2)}€
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
            >
              Proceed to checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Cart;
