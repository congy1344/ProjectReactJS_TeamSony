import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Divider,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  MenuItem,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { clearCart } from "../store/cartSlice";
import axios from "axios";

const Checkout = () => {
  const { items, total } = useSelector((state) => state.cart);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, login } = useAuth();
  const buyNowProduct = location.state?.buyNowProduct;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    paymentMethod: "cod",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    selectedAddressId: "",
  });

  const [errors, setErrors] = useState({});
  const displayItems = buyNowProduct ? [buyNowProduct] : items;
  const displayTotal = buyNowProduct ? buyNowProduct.price : total;

  const isCodEligible = () => {
    const eligibleCities = ['Ho Chi Minh City', 'Hanoi'];
    return eligibleCities.includes(formData.city?.trim());
  };

  const isFormValid = () => {
    // Check required fields
    const requiredFields = ["fullName", "email", "phone", "address", "city"];
    const hasEmptyField = requiredFields.some((field) => !formData[field]?.trim());
    if (hasEmptyField) return false;

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) return false;

    // Validate phone number (10-11 digits)
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) return false;

    // Validate payment method fields
    if (formData.paymentMethod === "online") {
      if (
        !formData.cardNumber?.trim() ||
        !formData.expiryDate?.trim() ||
        !formData.cvv?.trim()
      ) {
        return false;
      }
    }

    // If we get here, form is valid
    return true;
  };

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddress = user.addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setFormData((prev) => ({
          ...prev,
          fullName: defaultAddress.fullName,
          phone: defaultAddress.phone,
          address: `${defaultAddress.detail}, ${defaultAddress.wardName}, ${defaultAddress.districtName}`,
          city: defaultAddress.provinceName,
          selectedAddressId: defaultAddress.id,
        }));
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If changing address selection
    if (name === "selectedAddressId") {
      const selectedAddress = user.addresses.find((addr) => addr.id === value);
      if (selectedAddress) {
        setFormData((prev) => ({
          ...prev,
          selectedAddressId: value,
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          address: `${selectedAddress.detail}, ${selectedAddress.wardName}, ${selectedAddress.districtName}`,
          city: selectedAddress.provinceName,
        }));
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    // Validate email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate phone number (simple validation)
    if (
      formData.phone &&
      !/^\d{10,11}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Invalid phone number";
    }

    // Validate payment method fields
    if (formData.paymentMethod === "online") {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      }
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required";
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      }
    }

    // Validate COD eligibility
    if (formData.paymentMethod === "cod" && !isCodEligible()) {
      newErrors.paymentMethod =
        "COD is only available for Ho Chi Minh City and Hanoi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    // Validate form
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields correctly",
        severity: "error",
      });
      return;
    }

    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!user) {
      setSnackbar({
        open: true,
        message: "Vui lòng đăng nhập để đặt hàng",
        severity: "error",
      });
      return;
    }

    // Kiểm tra xem giỏ hàng có trống không
    if (displayItems.length === 0) {
      setSnackbar({
        open: true,
        message: "Giỏ hàng của bạn đang trống",
        severity: "error",
      });
      return;
    }

    try {
      // Tạo đơn hàng mới
      const newOrder = {
        id: `ORD${Date.now()}`,
        userId: user.id,
        items: displayItems,
        total: displayTotal,
        status: "In Transit",
        orderDate: new Date().toISOString(),
        deliveryDate: null,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        paymentMethod: formData.paymentMethod === "cod" ? "COD" : "Credit Card",
      };

      // Lấy thông tin user hiện tại
      const userResponse = await axios.get(
        `http://localhost:3001/users/${user.id}`
      );
      const currentUser = userResponse.data;

      // Cập nhật danh sách đơn hàng
      const updatedOrders = [...(currentUser.orders || []), newOrder];

      // Cập nhật thông tin user với đơn hàng mới
      const updatedUser = {
        ...currentUser,
        orders: updatedOrders,
      };

      await axios.put(`http://localhost:3001/users/${user.id}`, updatedUser);

      // Cập nhật thông tin user trong context
      login(updatedUser);

      // Xóa giỏ hàng sau khi đặt hàng thành công
      if (!buyNowProduct) {
        dispatch(clearCart());
      }

      // Hiển thị thông báo thành công
      setSnackbar({
        open: true,
        message: "Đặt hàng thành công!",
        severity: "success",
      });

      // Chuyển hướng đến trang đơn hàng sau 2 giây
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.",
        severity: "error",
      });
    }
  };

  return (
    <Container
      maxWidth="xl" // Tăng kích thước container lên xl
      sx={{
        py: 4,
        mt: "64px",
        minHeight: "calc(100vh - 64px)",
        px: { xs: 2, md: 6 }, // Tăng padding ngang
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
        Checkout
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
        }}
      >
        {/* Left side - Shipping Information */}
        <Box
          sx={{
            width: { md: "62%" }, // Tăng chiều rộng phần form
            pr: { md: 4 }, // Thêm padding bên phải
          }}
        >
          <Paper
            sx={{
              p: { xs: 3, md: 4 }, // Tăng padding bên trong
              mb: 3,
              bgcolor: "#f9f9f9",
              borderRadius: 2, // Bo tròn góc
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
              Shipping Information
            </Typography>

            {user && user.addresses && user.addresses.length > 0 && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Select a saved address:
                </Typography>
                <Select
                  value={formData.selectedAddressId}
                  onChange={handleChange}
                  name="selectedAddressId"
                >
                  {user.addresses.map((address) => (
                    <MenuItem key={address.id} value={address.id}>
                      {address.fullName} - {address.detail}, {address.wardName},{" "}
                      {address.districtName}, {address.provinceName}
                      {address.isDefault ? " (Default)" : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Grid container spacing={3}>
              {" "}
              {/* Tăng spacing giữa các field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  variant="outlined"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  sx={{
                    bgcolor: "white",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5, // Bo tròn góc input
                      height: 56, // Tăng chiều cao input
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  variant="outlined"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={{
                    bgcolor: "white",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      height: 56,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    bgcolor: "white",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      height: 56,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  error={!!errors.phone}
                  helperText={errors.phone}
                  sx={{
                    bgcolor: "white",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      height: 56,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  variant="outlined"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  error={!!errors.address}
                  helperText={errors.address}
                  sx={{
                    bgcolor: "white",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      height: 56,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  variant="outlined"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  error={!!errors.city}
                  helperText={errors.city}
                  sx={{
                    bgcolor: "white",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      height: 56,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              bgcolor: "#f9f9f9",
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
              Payment Method
            </Typography>

            <FormControl component="fieldset" sx={{ width: "100%", mb: 3 }}>
              <RadioGroup
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                sx={{ mb: 1 }}
              >
                <FormControlLabel
                  value="cod"
                  control={<Radio size="medium" />}
                  label={
                    <Typography sx={{ fontSize: "1rem" }}>
                      Cash on Delivery (COD)
                    </Typography>
                  }
                  sx={{ mb: 1 }}
                />
                <FormHelperText sx={{ ml: 4, mt: -1, mb: 2 }}>
                  * Only available for customers in Ho Chi Minh City and Hanoi
                </FormHelperText>

                <FormControlLabel
                  value="online"
                  control={<Radio size="medium" />}
                  label={
                    <Typography sx={{ fontSize: "1rem" }}>
                      Online Payment
                    </Typography>
                  }
                />
              </RadioGroup>
              {errors.paymentMethod && (
                <FormHelperText error sx={{ fontSize: "0.9rem", mt: 1 }}>
                  {errors.paymentMethod}
                </FormHelperText>
              )}
            </FormControl>

            {formData.paymentMethod === "online" && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    name="cardNumber"
                    variant="outlined"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required={formData.paymentMethod === "online"}
                    error={!!errors.cardNumber}
                    helperText={errors.cardNumber}
                    sx={{
                      bgcolor: "white",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        height: 56,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    name="expiryDate"
                    variant="outlined"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required={formData.paymentMethod === "online"}
                    error={!!errors.expiryDate}
                    helperText={errors.expiryDate}
                    sx={{
                      bgcolor: "white",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        height: 56,
                      },
                    }}
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    name="cvv"
                    variant="outlined"
                    value={formData.cvv}
                    onChange={handleChange}
                    required={formData.paymentMethod === "online"}
                    error={!!errors.cvv}
                    helperText={errors.cvv}
                    sx={{
                      bgcolor: "white",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        height: 56,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </Paper>
        </Box>

        {/* Right side - Order Summary */}
        <Box
          sx={{
            width: { md: "35%" },
            position: "fixed",
            right: { md: "40px" }, // Tăng khoảng cách từ bên phải
            top: "84px",
            maxWidth: { md: "35%" },
          }}
        >
          <Card
            sx={{
              bgcolor: "#e6e6e6",
              boxShadow: "none",
              borderRadius: 2,
              overflow: "auto",
              maxHeight: "calc(100vh - 100px)", // Giới hạn chiều cao và cho phép cuộn
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
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

              <Divider sx={{ my: 2 }} />

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
                onClick={handlePlaceOrder}
                disabled={!isFormValid()}
                sx={{
                  bgcolor: isFormValid() ? "black" : "#ccc",
                  color: "white",
                  py: 1.5,
                  borderRadius: 1.5,
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: isFormValid() ? "#333" : "#ccc",
                  },
                  "&.Mui-disabled": {
                    color: "#666",
                  },
                }}
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Checkout;
