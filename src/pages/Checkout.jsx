import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Checkout = () => {
  const { items, total } = useSelector((state) => state.cart);
  const location = useLocation();
  const { user } = useAuth();
  const buyNowProduct = location.state?.buyNowProduct;

  // Xác định sản phẩm và tổng tiền hiển thị
  const displayItems = buyNowProduct ? [buyNowProduct] : items;
  const displayTotal = buyNowProduct
    ? (buyNowProduct.price || buyNowProduct.basePrice) * buyNowProduct.quantity
    : total;

  // Cập nhật state cho form thông tin
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
  });

  // Cập nhật form khi user thay đổi
  useEffect(() => {
    if (user) {
      // Tìm địa chỉ mặc định
      const defaultAddress =
        user.addresses?.find((addr) => addr.isDefault) || user.addresses?.[0];

      setFormData({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: defaultAddress?.phone || user.phone || "",
        address: defaultAddress?.detail || "",
        city: defaultAddress
          ? `${defaultAddress.districtName}, ${defaultAddress.provinceName}`
          : "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Left side - Shipping Information */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
            Shipping Information
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              name="firstName"
              label="First Name"
              variant="outlined"
              value={formData.firstName}
              onChange={handleChange}
              sx={{ bgcolor: "white" }}
            />
            <TextField
              fullWidth
              name="lastName"
              label="Last Name"
              variant="outlined"
              value={formData.lastName}
              onChange={handleChange}
              sx={{ bgcolor: "white" }}
            />
          </Box>

          <TextField
            fullWidth
            name="email"
            label="Email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2, bgcolor: "white" }}
          />

          <TextField
            fullWidth
            name="phone"
            label="Phone Number"
            variant="outlined"
            value={formData.phone}
            onChange={handleChange}
            sx={{ mb: 2, bgcolor: "white" }}
          />

          <TextField
            fullWidth
            name="address"
            label="Address"
            variant="outlined"
            value={formData.address}
            onChange={handleChange}
            sx={{ mb: 2, bgcolor: "white" }}
          />

          <TextField
            fullWidth
            name="city"
            label="City"
            variant="outlined"
            value={formData.city}
            onChange={handleChange}
            sx={{ mb: 2, bgcolor: "white" }}
          />

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

              {displayItems.map((item) => (
                <Box key={item.id} sx={{ mb: 3 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {(item.price || item.basePrice).toLocaleString("vi-VN")}₫
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                  {item.color && (
                    <Typography variant="body2" color="text.secondary">
                      Color: {item.color}
                    </Typography>
                  )}
                  {item.dimension && (
                    <Typography variant="body2" color="text.secondary">
                      Dimension: {item.dimension}
                    </Typography>
                  )}
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal:{" "}
                      {(
                        (item.price || item.basePrice) * item.quantity
                      ).toLocaleString("vi-VN")}
                      ₫
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">
                  {displayTotal.toLocaleString("vi-VN")}₫
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1">Free</Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {displayTotal.toLocaleString("vi-VN")}₫
                </Typography>
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
