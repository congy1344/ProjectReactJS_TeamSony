const ProductCard = ({ product }) => {
  // Đảm bảo product có đầy đủ thuộc tính
  const safeProduct = {
    id: product?.id || "unknown",
    name: product?.name || "Unknown Product",
    price: product?.price || product?.basePrice || 0,
    image: product?.image || "/placeholder.jpg",
    // Các thuộc tính khác...
  };

  return (
    <Card>
      {/* Sử dụng safeProduct thay vì product trực tiếp */}
      <CardMedia
        component="img"
        height="140"
        image={safeProduct.image}
        alt={safeProduct.name}
      />
      <CardContent>
        <Typography variant="h6">{safeProduct.name}</Typography>
        <Typography variant="body1">
          {safeProduct.price.toLocaleString("vi-VN")}₫
        </Typography>
      </CardContent>
    </Card>
  );
};
