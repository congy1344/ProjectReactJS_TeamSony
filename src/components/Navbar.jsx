import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  InputBase,
} from "@mui/material";
import { ShoppingCart, Favorite, Person, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        width: "100vw",
        left: 0,
        right: 0,
        margin: 0,
        padding: 0,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          width: "100%",
          padding: "0 2rem",
          margin: 0,
          minHeight: "64px",
        }}
      >
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
          Minga
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f5f5f5",
            borderRadius: 1,
            px: 2,
            flex: 1,
            mx: 4,
            maxWidth: "600px",
          }}
        >
          <InputBase placeholder="Search..." sx={{ flex: 1 }} />
          <IconButton size="small">
            <Search />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton color="inherit" component={Link} to="/account">
            <Person />
          </IconButton>
          <IconButton color="inherit">
            <Favorite />
          </IconButton>
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
