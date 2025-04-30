import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { ShoppingCart, Person } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          SONY STORE
        </Typography>

        <Box sx={{ flexGrow: 1, ml: 4 }}>
          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {user ? (
            <>
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                Welcome, {user.name}
              </Typography>
              <Tooltip title="Account settings">
                <IconButton 
                  color="inherit" 
                  onClick={handleMenu}
                >
                  <Person />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              sx={{ textTransform: "none" }}
            >
              Login
            </Button>
          )}
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={cartItems.length} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;