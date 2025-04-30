import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/login';
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      // Check if email already exists
      const checkEmail = await axios.get(
        `http://localhost:3001/users?email=${formData.email}`
      );
      
      if (checkEmail.data.length > 0) {
        setError("Email already exists");
        return;
      }

      // Create new user
      await axios.post("http://localhost:3001/users", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate('/login', { state: { from } });
    } catch (error) {
      setError("Registration failed");
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
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            {error && (
              <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                {error}
              </Typography>
            )}
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
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