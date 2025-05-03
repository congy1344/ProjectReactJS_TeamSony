import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Favorite, ShoppingCart } from "@mui/icons-material";
import { addToCart } from "../store/cartSlice";
import { removeFromWishlist } from "../store/wishlistSlice";

const Wishlist = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  if (wishlistItems.length === 0) {
    return (
      <Box sx={{ mt: "80px", textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          Chưa có sản phẩm yêu thích nào!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: "80px", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách yêu thích
      </Typography>
      <Grid container spacing={3}>
        {wishlistItems.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  {product.price.toLocaleString("vi-VN")}₫
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      dispatch(addToCart({ ...product, quantity: 1 }))
                    }
                  >
                    <ShoppingCart />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => dispatch(removeFromWishlist(product.id))}
                  >
                    <Favorite />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Wishlist;
