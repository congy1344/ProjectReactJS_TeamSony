import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  InputBase,
  Divider,
  Tooltip,
  Paper,
  Popper,
  Grow,
  MenuList,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Search,
  ShoppingCart,
  Person,
  Favorite,
  Clear,
  LocalShipping,
  Dashboard,
  People,
  ShoppingBasket,
  Logout,
} from "@mui/icons-material";
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
  maxWidth: "500px",
  [theme.breakpoints.down("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
  border: "1px solid rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:focus-within": {
    boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(0, 0, 0, 0.2)",
  },
  display: "flex",
  alignItems: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.2, 1, 1.2, 2), // Thay đổi padding để không cần SearchIconWrapper
    width: "100%",
    fontSize: "0.95rem",
    transition: theme.transitions.create("width"),
  },
}));

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    // Ngăn chặn hành vi mặc định của form
    if (e) e.preventDefault();

    // Chỉ tìm kiếm khi có từ khóa
    if (searchQuery && searchQuery.trim()) {
      const trimmedQuery = searchQuery.trim();
      console.log("Submitting search for:", trimmedQuery);

      // Chuyển hướng đến trang products với tham số tìm kiếm
      navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const adminMenuItems = [
    {
      label: "Quản lý sản phẩm",
      icon: <ShoppingBasket />,
      path: "/admin/products",
    },
    {
      label: "Quản lý đơn hàng",
      icon: <Dashboard />,
      path: "/admin/orders",
    },
    {
      label: "Quản lý người dùng",
      icon: <People />,
      path: "/admin/users",
    },
  ];

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
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".2rem",
            color: "inherit",
            textDecoration: "none",
            position: "relative",
            "&:hover": {
              color: "primary.main",
              transform: "scale(1.05)",
              transition: "all 0.3s ease",
              "&::after": {
                width: "100%",
                opacity: 1,
              },
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -2,
              left: 0,
              width: "0%",
              height: "2px",
              backgroundColor: "primary.main",
              transition: "width 0.3s ease, opacity 0.3s ease",
              opacity: 0,
            },
            transition: "all 0.3s ease",
          }}
        >
          SONY STORE
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <SearchBox component="form" onSubmit={handleSearchSubmit}>
            <StyledInputBase
              placeholder="Search products..."
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ paddingLeft: 2 }}
            />
            {searchQuery && (
              <IconButton
                size="small"
                sx={{ mr: 1 }}
                onClick={handleClearSearch}
              >
                <Clear fontSize="small" />
              </IconButton>
            )}
            <IconButton
              type="submit"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={handleSearchSubmit}
            >
              <Search />
            </IconButton>
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
                          boxShadow: "0px 2px 8px rgba(0,0,0,0.16)",
                          minWidth: 180,
                        }}
                        onMouseEnter={() => setOpen(true)}
                      >
                        <MenuList>
                          {isAdmin() && (
                            <>
                              <Box sx={{ px: 2, py: 1 }}>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Quản lý hệ thống
                                </Typography>
                              </Box>
                              {adminMenuItems.map((item) => (
                                <MenuItem
                                  key={item.path}
                                  onClick={() => {
                                    navigate(item.path);
                                    handleClose();
                                  }}
                                  sx={{
                                    py: 1,
                                    px: 2,
                                    "&:hover": { bgcolor: "action.hover" },
                                  }}
                                >
                                  <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.icon}
                                  </ListItemIcon>
                                  <ListItemText primary={item.label} />
                                </MenuItem>
                              ))}
                              <Divider />
                            </>
                          )}
                          <MenuItem
                            onClick={() => {
                              navigate("/account-setting");
                              handleClose();
                            }}
                            sx={{ py: 1, px: 2 }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <Person fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Tài khoản của tôi" />
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/orders"
                            onClick={handleClose}
                            sx={{ py: 1, px: 2 }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <LocalShipping fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Đơn hàng của tôi" />
                          </MenuItem>
                          <MenuItem
                            onClick={handleLogout}
                            sx={{ py: 1, px: 2 }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <Logout fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Đăng xuất" />
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

          <Tooltip title="My Orders">
            <IconButton
              component={Link}
              to="/orders"
              color="inherit"
              sx={{
                ml: 2,
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <LocalShipping />
            </IconButton>
          </Tooltip>

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
              ml: 2,
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
