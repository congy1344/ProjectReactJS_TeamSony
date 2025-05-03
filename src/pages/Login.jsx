import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Tìm kiếm user bằng email
      const response = await axios.get(
        `http://localhost:3001/users?email=${email}`
      );
      const user = response.data[0];

      if (user && user.password === password) {
        login({
          ...user,
          cart: user.cart || { items: [], total: 0 },
          wishlist: user.wishlist || { items: [] },
        });
        navigate("/");
      } else {
        setError("Email hoặc mật khẩu không đúng");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Đã có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Đăng nhập
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Link href="/register" variant="body2">
              Chưa có tài khoản? Đăng ký
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
