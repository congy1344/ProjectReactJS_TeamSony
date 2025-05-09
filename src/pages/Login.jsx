import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Lấy BASE_URL từ api
      const BASE_URL = api.getBaseUrl();
      console.log("Using BASE_URL for login:", BASE_URL);

      // Tìm kiếm user bằng email hoặc username
      const [emailResponse, usernameResponse] = await Promise.all([
        axios.get(`${BASE_URL}/users?email=${formData.emailOrUsername}`),
        axios.get(`${BASE_URL}/users?username=${formData.emailOrUsername}`),
      ]);

      // Kết hợp kết quả từ cả hai truy vấn
      const user = emailResponse.data[0] || usernameResponse.data[0];

      if (user && user.password === formData.password) {
        login({
          ...user,
          hasChangedUsername: user.hasChangedUsername || false,
        });
        navigate(from, { replace: true });
      } else {
        setError("Email/Username hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      setError("Đã có lỗi xảy ra, vui lòng thử lại");
      console.error("Login error:", error);
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email hoặc Username"
              name="emailOrUsername"
              autoComplete="email"
              autoFocus
              value={formData.emailOrUsername}
              onChange={(e) =>
                setFormData({ ...formData, emailOrUsername: e.target.value })
              }
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                bgcolor: "#1a1a1a",
                "&:hover": {
                  bgcolor: "#333",
                },
              }}
            >
              Sign In
            </Button>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Typography variant="body2" sx={{ mr: 1 }}>
                Don't have an account?
              </Typography>
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#1a1a1a",
                  fontWeight: "bold",
                }}
              >
                Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
