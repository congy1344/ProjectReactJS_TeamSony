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
        email: "",
        password: ""
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.get(
          `http://localhost:3001/users?email=${formData.email}`
        );
        const user = response.data[0];
        
        if (user && user.password === formData.password) {
          login(user);
          navigate(from, { replace: true });
        } else {
          setError("Invalid email or password");
        }
      } catch (error) {
        setError("Something went wrong");
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
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
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