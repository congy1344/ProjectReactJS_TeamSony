import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";

// Import api từ api.js
import { api } from "../api/api";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
      errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    }
    if (!hasUpperCase) {
      errors.push("Mật khẩu phải chứa ít nhất 1 chữ hoa");
    }
    if (!hasLowerCase) {
      errors.push("Mật khẩu phải chứa ít nhất 1 chữ thường");
    }
    if (!hasNumbers) {
      errors.push("Mật khẩu phải chứa ít nhất 1 số");
    }
    if (!hasSpecialChar) {
      errors.push("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt");
    }

    return errors;
  };

  const validateUsername = (username) => {
    const errors = [];
    if (username.length < 3) {
      errors.push("Username phải có ít nhất 3 ký tự");
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push("Username chỉ được chứa chữ cái, số và dấu gạch dưới");
    }
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate username
    const usernameErrors = validateUsername(formData.username);
    if (usernameErrors.length > 0) {
      newErrors.username = usernameErrors[0];
    }

    // Validate password
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0];
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const BASE_URL = api.getBaseUrl();
      console.log("Using BASE_URL for register:", BASE_URL);

      // Kiểm tra email và username đã tồn tại chưa
      const [emailCheck, usernameCheck] = await Promise.all([
        axios.get(`${BASE_URL}/users?email=${formData.email}`),
        axios.get(`${BASE_URL}/users?username=${formData.username}`),
      ]);

      if (emailCheck.data.length > 0) {
        setErrors({ email: "Email đã được sử dụng" });
        return;
      }

      if (usernameCheck.data.length > 0) {
        setErrors({ username: "Username đã được sử dụng" });
        return;
      }

      // Tạo tài khoản mới
      await axios.post(`${BASE_URL}/users`, {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        hasChangedUsername: false,
      });

      navigate("/login", { state: { from } });
    } catch (error) {
      setErrors({ submit: "Đăng ký thất bại, vui lòng thử lại" });
      console.error("Registration error:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        mt: "-64px",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: "400px",
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            {errors.submit && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.submit}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              name="name"
              autoFocus
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "primary.main" }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
