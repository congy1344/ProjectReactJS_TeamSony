import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TikTokIcon from "@mui/icons-material/MusicNote"; // Sử dụng MusicNote thay cho TikTok

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1a1a1a",
        color: "white",
        py: 4,
        mt: "auto",
        width: "100vw",
        position: "relative",
        left: 0,
        zIndex: 1,
        boxSizing: "border-box",
        marginLeft: 0,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: "100%",
        }}
      >
        <Grid container spacing={4}>
          {/* Thông tin cửa hàng */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                position: "relative",
                display: "inline-block",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: "40px",
                  height: "2px",
                  bottom: "-8px",
                  left: 0,
                  backgroundColor: "primary.main",
                },
              }}
            >
              Furniture Store
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Cung cấp các sản phẩm nội thất chất lượng cao với giá cả hợp lý.
            </Typography>
            <Typography variant="body2">
              Địa chỉ: 123 Nguyễn Văn Linh, Q.7, TP.HCM
            </Typography>
            <Typography variant="body2">Điện thoại: 0123 456 789</Typography>
            <Typography variant="body2">
              Email: contact@furniturestore.com
            </Typography>
          </Grid>

          {/* Kết nối mạng xã hội */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                position: "relative",
                display: "inline-block",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: "40px",
                  height: "2px",
                  bottom: "-8px",
                  left: 0,
                  backgroundColor: "primary.main",
                },
              }}
            >
              Kết nối với chúng tôi
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              <IconButton
                aria-label="facebook"
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#3b5998",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                aria-label="instagram"
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#C13584",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                aria-label="tiktok"
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#000000",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <TikTokIcon />
              </IconButton>
              <IconButton
                aria-label="youtube"
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#FF0000",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                aria-label="twitter"
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#1DA1F2",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <TwitterIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Theo dõi chúng tôi trên mạng xã hội để cập nhật những sản phẩm mới
              nhất và khuyến mãi đặc biệt.
            </Typography>
          </Grid>

          {/* Thông tin & Hỗ trợ */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                position: "relative",
                display: "inline-block",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: "40px",
                  height: "2px",
                  bottom: "-8px",
                  left: 0,
                  backgroundColor: "primary.main",
                },
              }}
            >
              Hỗ trợ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Link
                component={RouterLink}
                to="/about"
                color="inherit"
                underline="none"
                sx={{
                  mb: 1.5,
                  transition: "all 0.3s ease",
                  display: "inline-block",
                  position: "relative",
                  "&:hover": {
                    color: "#ffffff",
                    transform: "translateX(5px)",
                  },
                  "&:before": {
                    content: '"›"',
                    marginRight: "8px",
                    fontSize: "18px",
                  },
                }}
              >
                Về chúng tôi
              </Link>
              <Link
                component={RouterLink}
                to="/shipping-policy"
                color="inherit"
                underline="none"
                sx={{
                  mb: 1.5,
                  transition: "all 0.3s ease",
                  display: "inline-block",
                  position: "relative",
                  "&:hover": {
                    color: "#ffffff",
                    transform: "translateX(5px)",
                  },
                  "&:before": {
                    content: '"›"',
                    marginRight: "8px",
                    fontSize: "18px",
                  },
                }}
              >
                Chính sách vận chuyển
              </Link>
              <Link
                component={RouterLink}
                to="/return-policy"
                color="inherit"
                underline="none"
                sx={{
                  mb: 1.5,
                  transition: "all 0.3s ease",
                  display: "inline-block",
                  position: "relative",
                  "&:hover": {
                    color: "#ffffff",
                    transform: "translateX(5px)",
                  },
                  "&:before": {
                    content: '"›"',
                    marginRight: "8px",
                    fontSize: "18px",
                  },
                }}
              >
                Chính sách đổi trả
              </Link>
              <Link
                component={RouterLink}
                to="/privacy-policy"
                color="inherit"
                underline="none"
                sx={{
                  mb: 1.5,
                  transition: "all 0.3s ease",
                  display: "inline-block",
                  position: "relative",
                  "&:hover": {
                    color: "#ffffff",
                    transform: "translateX(5px)",
                  },
                  "&:before": {
                    content: '"›"',
                    marginRight: "8px",
                    fontSize: "18px",
                  },
                }}
              >
                Chính sách bảo mật
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                color="inherit"
                underline="none"
                sx={{
                  mb: 1.5,
                  transition: "all 0.3s ease",
                  display: "inline-block",
                  position: "relative",
                  "&:hover": {
                    color: "#ffffff",
                    transform: "translateX(5px)",
                  },
                  "&:before": {
                    content: '"›"',
                    marginRight: "8px",
                    fontSize: "18px",
                  },
                }}
              >
                Liên hệ
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.2)" }} />

        {/* Phần dưới cùng */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "center" : "flex-start",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <Typography
            variant="body2"
            color="white"
            sx={{ mb: isMobile ? 1 : 0 }}
          >
            © {new Date().getFullYear()} Furniture Store. Tất cả quyền được bảo
            lưu.
          </Typography>
          <Box>
            <Link
              component={RouterLink}
              to="/terms"
              color="inherit"
              underline="hover"
              sx={{ mx: 1 }}
            >
              Điều khoản sử dụng
            </Link>
            <Link
              component={RouterLink}
              to="/privacy"
              color="inherit"
              underline="hover"
              sx={{ mx: 1 }}
            >
              Chính sách bảo mật
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
