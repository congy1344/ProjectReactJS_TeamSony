import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import AddressSection from "../components/AddressSection";

const AccountSetting = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    hasChangedUsername: user?.hasChangedUsername || false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [activeSection, setActiveSection] = useState('profile');

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Reset password form when switching away from password section
    if (sectionId !== 'password') {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kiểm tra email có tồn tại chưa
      if (formData.email !== user.email) {
        const emailCheck = await axios.get(`http://localhost:3001/users?email=${formData.email}`);
        if (emailCheck.data.length > 0) {
          setSnackbar({
            open: true,
            message: "Email đã tồn tại",
            severity: "error"
          });
          return;
        }
      }

      // Cập nhật thông tin user
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        hasChangedUsername: true
      };

      await axios.put(`http://localhost:3001/users/${user.id}`, updatedUser);
      
      // Cập nhật context
      login(updatedUser);
      
      setSnackbar({
        open: true,
        message: "Cập nhật thông tin thành công",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi cập nhật thông tin",
        severity: "error"
      });
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    try {
      // Verify current password first
      const userResponse = await axios.get(`http://localhost:3001/users/${user.id}`);
      const currentUser = userResponse.data;

      if (currentUser.password !== passwordForm.currentPassword) {
        setSnackbar({
          open: true,
          message: "Mật khẩu hiện tại không đúng",
          severity: "error"
        });
        return;
      }

      // Validate new password
      if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
        setSnackbar({
          open: true,
          message: "Mật khẩu mới không khớp",
          severity: "error"
        });
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        setSnackbar({
          open: true,
          message: "Mật khẩu mới phải có ít nhất 6 ký tự",
          severity: "error"
        });
        return;
      }

      // Check if new password is same as current password
      if (passwordForm.newPassword === passwordForm.currentPassword) {
        setSnackbar({
          open: true,
          message: "Mật khẩu mới không được giống mật khẩu hiện tại",
          severity: "error"
        });
        return;
      }

      // Update password
      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        password: passwordForm.newPassword
      });

      // Reset form and show success message
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setSnackbar({
        open: true,
        message: "Đổi mật khẩu thành công",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi đổi mật khẩu",
        severity: "error"
      });
      console.error("Error changing password:", error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Hồ Sơ Của Tôi
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ width: 200 }}>Tên đăng nhập</Typography>
                    <TextField
                      fullWidth
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      disabled={user?.hasChangedUsername}
                      helperText={user?.hasChangedUsername ? "Tên đăng nhập chỉ được thay đổi một lần" : ""}
                      sx={{ maxWidth: 500 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ width: 200 }}>Tên</Typography>
                    <TextField
                      fullWidth
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      sx={{ maxWidth: 500 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ width: 200 }}>Email</Typography>
                    <TextField
                      fullWidth
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      sx={{ maxWidth: 500 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ ml: 2 }}
                    >
                      Thay Đổi
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ width: 200 }}>Số điện thoại</Typography>
                    <TextField
                      fullWidth
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      sx={{ maxWidth: 500 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ ml: 2 }}
                    >
                      Thay Đổi
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ width: 200 }}>Giới tính</Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      {["Nam", "Nữ", "Khác"].map((gender) => (
                        <Box
                          key={gender}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                          />
                          <Typography>{gender}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ width: 200 }}>Ngày sinh</Typography>
                    <Box sx={{ display: "flex", gap: 2, maxWidth: 500 }}>
                      <TextField
                        select
                        fullWidth
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option>Ngày</option>
                        {[...Array(31)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </TextField>
                      <TextField
                        select
                        fullWidth
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option>Tháng</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </TextField>
                      <TextField
                        select
                        fullWidth
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option>Năm</option>
                        {[...Array(100)].map((_, i) => (
                          <option key={i} value={2024 - i}>
                            {2024 - i}
                          </option>
                        ))}
                      </TextField>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 3,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ minWidth: 120 }}
                    >
                      Lưu
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
      case 'address':
        return <AddressSection />;
      case 'bank':
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Tài khoản ngân hàng của tôi
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
              Quản lý thông tin tài khoản ngân hàng
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Box>
        );
      case 'password':
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Đổi mật khẩu
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
              Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handlePasswordChange}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ width: 200 }}>Mật khẩu hiện tại</Typography>
                    <TextField
                      type="password"
                      fullWidth
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      required
                      sx={{ maxWidth: 500 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ width: 200 }}>Mật khẩu mới</Typography>
                    <TextField
                      type="password"
                      fullWidth
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      required
                      sx={{ maxWidth: 500 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ width: 200 }}>Xác nhận mật khẩu mới</Typography>
                    <TextField
                      type="password"
                      fullWidth
                      value={passwordForm.confirmNewPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })
                      }
                      required
                      sx={{ maxWidth: 500 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 3,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ minWidth: 120 }}
                    >
                      Đổi mật khẩu
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        pt: { xs: 8, md: 12 },
        pb: 4
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3
        }}
      >
        {/* Left Sidebar */}
        <Box 
          sx={{ 
            width: { xs: '100%', md: '280px' },
            flexShrink: 0
          }}
        >
          <Box
            sx={{
              position: { md: 'sticky' },
              top: '88px',
              width: '100%',
              zIndex: 1
            }}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: 2,
                borderRadius: 2
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{ width: 60, height: 60, mr: 2 }}
                  src={user?.avatar}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user?.name}
                  </Typography>
                  <Button
                    size="small"
                    sx={{ 
                      textTransform: "none",
                      p: 0,
                      color: "text.secondary" 
                    }}
                  >
                    Chọn Ảnh
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {[
                  { id: 'profile', label: 'Hồ Sơ' },
                  { id: 'bank', label: 'Ngân Hàng' },
                  { id: 'address', label: 'Địa Chỉ' },
                  { id: 'password', label: 'Đổi Mật Khẩu' },
                ].map((item) => (
                  <Typography
                    key={item.id}
                    component="div"
                    onClick={() => handleSectionChange(item.id)}
                    sx={{
                      p: 1,
                      cursor: "pointer",
                      borderRadius: 1,
                      bgcolor: activeSection === item.id ? "black" : "transparent",
                      color: activeSection === item.id ? "white" : "inherit",
                      "&:hover": {
                        bgcolor: activeSection === item.id ? "black" : "action.hover",
                      },
                    }}
                  >
                    {item.label}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Main Content */}
        <Box 
          sx={{ 
            flex: 1,
            minWidth: 0 // Prevent flex item from overflowing
          }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 2,
              width: '828px'
            }}
          >
            <Box sx={{ 
              width: '100%',
              p: 3
            }}>
              {renderContent()}
            </Box>
          </Paper>
        </Box>
      </Container>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountSetting;