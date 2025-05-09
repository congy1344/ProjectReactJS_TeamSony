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

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const location = useLocation();
    const from = location.state?.from || '/';

    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        emailOrUsername: "",
        password: ""
    });
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const [emailResponse, usernameResponse] = await Promise.all([
                axios.get(`http://localhost:3001/users?email=${formData.emailOrUsername}`),
                axios.get(`http://localhost:3001/users?username=${formData.emailOrUsername}`)
            ]);

            const user = emailResponse.data[0] || usernameResponse.data[0];

            if (!user) {
                setError("Invalid email/username or password");
                return;
            }

            if (user.password !== formData.password) {
                setError("Invalid email/username or password");
                return;
            }

            login(user);
            setError("");
            // Redirect to previous page or home for all users
            navigate(from);
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred during login");
        }
    };

    return (
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            mt: '-64px'
          }}
        >
          <Container 
            maxWidth="xs" 
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Paper
              elevation={3}
              sx={{
                width: '100%',
                maxWidth: '400px',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0px 3px 15px rgba(0,0,0,0.2)'
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
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      style={{ textDecoration: "none", color: "primary.main" }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>
    );
};

export default Login;