import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Button,
  Popper,
  Paper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Tooltip,
  InputBase,
} from "@mui/material";
import { ShoppingCart, Person, Favorite, Search } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import { styled, alpha } from "@mui/material/styles";

const SearchBox = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: "100%",
  maxWidth: "400px",
  [theme.breakpoints.down("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: alpha(theme.palette.common.black, 0.54),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleAccountSettings = () => {
    navigate("/account-setting");
    setOpen(false);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 1,
        bgcolor: "white",
        color: "black",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
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

        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Button
            component={Link}
            to="/products"
            sx={{
              color: "inherit",
              ml: 4,
              "&:hover": { bgcolor: "transparent", color: "primary.main" },
            }}
          >
            PRODUCTS
          </Button>

          <SearchBox>
            <SearchIconWrapper>
              <Search />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search products..."
              inputProps={{ "aria-label": "search" }}
            />
          </SearchBox>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user ? (
            <>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Welcome, {user.name}
              </Typography>
              <Box 
                sx={{ position: "relative" }}
                onMouseLeave={handleMouseLeave}
              >
                <IconButton
                  color="inherit"
                  onMouseEnter={handleMouseEnter}
                  sx={{
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  <Person />
                </IconButton>
                <Popper
                  open={open}
                  anchorEl={anchorEl}
                  placement="bottom-end"
                  transition
                  style={{ zIndex: 1301 }}
                  onMouseLeave={handleMouseLeave}
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                      <Paper 
                        elevation={0}
                        sx={{
                          borderRadius: 1,
                          mt: 1,
                          boxShadow: '0px 2px 8px rgba(0,0,0,0.16)',
                          minWidth: 180
                        }}
                        onMouseEnter={() => setOpen(true)}
                      >
                        <MenuList>
                          <MenuItem 
                            component={Link} 
                            to="/account-setting"
                            onClick={handleClose}
                          >
                            Account Settings
                          </MenuItem>
                          <MenuItem onClick={handleLogout}>
                            Log out
                          </MenuItem>
                        </MenuList>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Box>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{
                color: "inherit",
                "&:hover": { bgcolor: "transparent", color: "primary.main" },
              }}
            >
              Login
            </Button>
          )}
          <IconButton
            component={Link}
            to="/wishlist"
            color="inherit"
            sx={{ ml: 2 }}
          >
            <Badge badgeContent={wishlistItems.length} color="error">
              <Favorite />
            </Badge>
          </IconButton>

          <IconButton
            component={Link}
            to="/cart"
            color="inherit"
            sx={{
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
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
