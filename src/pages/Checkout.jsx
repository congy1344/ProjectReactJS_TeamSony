import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { items, total } = useSelector((state) => state.cart);

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
      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Left side - Shipping Information */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
            Shipping Information
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              sx={{ bgcolor: "white" }}
            />
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              sx={{ bgcolor: "white" }}
            />
          </Box>

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            sx={{ mb: 2, bgcolor: "white" }}
          />

          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            sx={{ mb: 2, bgcolor: "white" }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="City"
              variant="outlined"
              sx={{ bgcolor: "white" }}
            />
            <TextField
              fullWidth
              label="Postal Code"
              variant="outlined"
              sx={{ bgcolor: "white" }}
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 2, bgcolor: "white" }}>
            <InputLabel>Country</InputLabel>
            <Select label="Country">
              <MenuItem value="us">United States</MenuItem>
              <MenuItem value="uk">United Kingdom</MenuItem>
              <MenuItem value="fr">France</MenuItem>
              <MenuItem value="de">Germany</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h5" sx={{ mt: 4, mb: 3, fontWeight: 500 }}>
            Payment Method
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Card Number"
              variant="outlined"
              sx={{ bgcolor: "white" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Expiry Date"
              variant="outlined"
              sx={{ bgcolor: "white" }}
            />
            <TextField
              fullWidth
              label="CVV"
              variant="outlined"
              sx={{ bgcolor: "white" }}
            />
          </Box>
        </Box>

        {/* Right side - Order Summary */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ bgcolor: "#e6e6e6", boxShadow: "none" }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
                Order Summary
              </Typography>

              {items.map((item) => (
                <Box key={item.id} sx={{ mb: 2 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body1">
                      {item.price.toFixed(2)}€
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Subtotal</Typography>
                <Typography>{total.toFixed(2)}€</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Shipping</Typography>
                <Typography>0.00€</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Tax</Typography>
                <Typography>0.00€</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">{total.toFixed(2)}€</Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "black",
                  color: "white",
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "black",
                  },
                }}
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Checkout;
