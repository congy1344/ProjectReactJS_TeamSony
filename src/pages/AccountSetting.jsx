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
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Radio,
  RadioGroup,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import AddressSection from "../components/AddressSection";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { api } from "../api/api";

const AccountSetting = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "Nam",
    birthDate: user?.birthDate || {
      day: "",
      month: "",
      year: "",
    },
    hasChangedUsername: user?.hasChangedUsername || false,
  });

  const [bankCards, setBankCards] = useState(user?.bankCards || []);
  const [openBankDialog, setOpenBankDialog] = useState(false);
  const [newBankCard, setNewBankCard] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    bankName: "",
    isDefault: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [activeSection, setActiveSection] = useState("profile");

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId !== "password") {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  };

  useEffect(() => {
    if (user?.birthDate) {
      setFormData((prev) => ({
        ...prev,
        birthDate: user.birthDate,
      }));
    }
    if (user?.gender) {
      setFormData((prev) => ({
        ...prev,
        gender: user.gender,
      }));
    }
    if (user?.bankCards) {
      setBankCards(user.bankCards);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const BASE_URL = api.getBaseUrl();

      if (formData.email !== user.email) {
        const emailCheck = await axios.get(
          `${BASE_URL}/users?email=${formData.email}`
        );
        if (emailCheck.data.length > 0) {
          setSnackbar({
            open: true,
            message: "Email đã tồn tại",
            severity: "error",
          });
          return;
        }
      }

      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        gender: formData.gender,
        birthDate: formData.birthDate,
        hasChangedUsername: true,
      };

      await axios.put(`${BASE_URL}/users/${user.id}`, updatedUser);
      login(updatedUser);
      setSnackbar({
        open: true,
        message: "Cập nhật thông tin thành công",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbar({
        open: true,
        message: "Cập nhật thông tin thất bại",
        severity: "error",
      });
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength)
      return "Mật khẩu phải có ít nhất 8 ký tự";
    if (!hasUpperCase)
      return "Mật khẩu phải chứa ít nhất 1 chữ hoa";
    if (!hasLowerCase)
      return "Mật khẩu phải chứa ít nhất 1 chữ thường";
    if (!hasNumbers)
      return "Mật khẩu phải chứa ít nhất 1 số";
    if (!hasSpecialChar)
      return "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt";
    return "";
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const BASE_URL = api.getBaseUrl();

    // Kiểm tra trường rỗng
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmNewPassword
    ) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập đầy đủ tất cả các trường",
        severity: "error",
      });
      return;
    }

    // Kiểm tra mật khẩu hiện tại
    try {
      const userResponse = await axios.get(`${BASE_URL}/users/${user.id}`);
      const currentUser = userResponse.data;

      if (currentUser.password !== passwordForm.currentPassword) {
        setSnackbar({
          open: true,
          message: "Mật khẩu hiện tại không đúng",
          severity: "error",
        });
        return;
      }

      // Kiểm tra xác nhận mật khẩu
      if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
        setSnackbar({
          open: true,
          message: "Mật khẩu xác nhận không khớp",
          severity: "error",
        });
        return;
      }

      // Kiểm tra trùng mật khẩu cũ
      if (passwordForm.newPassword === passwordForm.currentPassword) {
        setSnackbar({
          open: true,
          message: "Mật khẩu mới không được giống mật khẩu hiện tại",
          severity: "error",
        });
        return;
      }

      // Regex độ mạnh mật khẩu
      const passwordError = validatePassword(passwordForm.newPassword);
      if (passwordError) {
        setSnackbar({
          open: true,
          message: passwordError,
          severity: "error",
        });
        return;
      }

      // Đổi mật khẩu
      await axios.patch(`${BASE_URL}/users/${user.id}`, {
        password: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setSnackbar({
        open: true,
        message: "Đổi mật khẩu thành công",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi đổi mật khẩu",
        severity: "error",
      });
      console.error("Error changing password:", error);
    }
  };

  const handleAddBankCard = async () => {
    try {
      const BASE_URL = api.getBaseUrl();
      const updatedUser = {
        ...user,
        bankCards: [
          ...(user.bankCards || []),
          {
            ...newBankCard,
            id: Date.now().toString(),
            isDefault: bankCards.length === 0 ? true : newBankCard.isDefault,
          },
        ],
      };

      await axios.put(`${BASE_URL}/users/${user.id}`, updatedUser);
      login(updatedUser);
      setOpenBankDialog(false);
      setNewBankCard({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        bankName: "",
        isDefault: false,
      });
      setSnackbar({
        open: true,
        message: "Thêm thẻ ngân hàng thành công",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi thêm thẻ ngân hàng",
        severity: "error",
      });
    }
  };

  const handleDeleteBankCard = async (cardId) => {
    try {
      const BASE_URL = api.getBaseUrl();
      const updatedCards = bankCards.filter((card) => card.id !== cardId);
      const updatedUser = {
        ...user,
        bankCards: updatedCards,
      };

      await axios.put(`${BASE_URL}/users/${user.id}`, updatedUser);
      login(updatedUser);
      setSnackbar({
        open: true,
        message: "Xóa thẻ ngân hàng thành công",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi xóa thẻ ngân hàng",
        severity: "error",
      });
    }
  };

  const handleSetDefaultCard = async (cardId) => {
    try {
      const BASE_URL = api.getBaseUrl();
      const updatedCards = bankCards.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      }));
      const updatedUser = {
        ...user,
        bankCards: updatedCards,
      };

      await axios.put(`${BASE_URL}/users/${user.id}`, updatedUser);
      login(updatedUser);
      setSnackbar({
        open: true,
        message: "Đặt thẻ mặc định thành công",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi đặt thẻ mặc định",
        severity: "error",
      });
    }
  };

  const renderBankContent = () => (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Tài khoản ngân hàng của tôi
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Quản lý thông tin tài khoản ngân hàng
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenBankDialog(true)}
        sx={{ mb: 3 }}
      >
        Thêm thẻ ngân hàng
      </Button>

      <Grid container spacing={2}>
        {bankCards.map((card) => (
          <Grid item xs={12} key={card.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6">{card.bankName}</Typography>
                    <Typography>
                      **** **** **** {card.cardNumber.slice(-4)}
                    </Typography>
                    <Typography>{card.cardHolder}</Typography>
                    <Typography>Hết hạn: {card.expiryDate}</Typography>
                    {card.isDefault && (
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "12px",
                          color: "#4CAF50",
                          backgroundColor: "#E8F5E9",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          display: "inline-block",
                          mt: 1,
                        }}
                      >
                        Mặc định
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    {!card.isDefault && (
                      <Button
                        size="small"
                        onClick={() => handleSetDefaultCard(card.id)}
                        sx={{ mr: 1 }}
                      >
                        Đặt mặc định
                      </Button>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteBankCard(card.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openBankDialog} onClose={() => setOpenBankDialog(false)}>
        <DialogTitle>Thêm thẻ ngân hàng mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Tên ngân hàng"
                fullWidth
                value={newBankCard.bankName}
                onChange={(e) =>
                  setNewBankCard({ ...newBankCard, bankName: e.target.value })
                }
                select
              >
                <MenuItem value="Vietcombank">Vietcombank</MenuItem>
                <MenuItem value="Techcombank">Techcombank</MenuItem>
                <MenuItem value="BIDV">BIDV</MenuItem>
                <MenuItem value="Agribank">Agribank</MenuItem>
                <MenuItem value="MB Bank">MB Bank</MenuItem>
                <MenuItem value="TPBank">TPBank</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Số thẻ"
                fullWidth
                value={newBankCard.cardNumber}
                onChange={(e) =>
                  setNewBankCard({ ...newBankCard, cardNumber: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tên chủ thẻ"
                fullWidth
                value={newBankCard.cardHolder}
                onChange={(e) =>
                  setNewBankCard({ ...newBankCard, cardHolder: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ngày hết hạn (MM/YY)"
                fullWidth
                value={newBankCard.expiryDate}
                onChange={(e) =>
                  setNewBankCard({ ...newBankCard, expiryDate: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio
                    checked={newBankCard.isDefault}
                    onChange={(e) =>
                      setNewBankCard({
                        ...newBankCard,
                        isDefault: e.target.checked,
                      })
                    }
                  />
                }
                label="Đặt làm thẻ mặc định"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBankDialog(false)}>Hủy</Button>
          <Button onClick={handleAddBankCard} variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <Box sx={{ width: "100%" }}>
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
                      helperText={
                        user?.hasChangedUsername
                          ? "Tên đăng nhập chỉ được thay đổi một lần"
                          : ""
                      }
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
                    <Button variant="outlined" size="small" sx={{ ml: 2 }}>
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
                    <Button variant="outlined" size="small" sx={{ ml: 2 }}>
                      Thay Đổi
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ width: 200 }}>Giới tính</Typography>
                    <RadioGroup
                      row
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      {["Nam", "Nữ", "Khác"].map((gender) => (
                        <FormControlLabel
                          key={gender}
                          value={gender}
                          control={<Radio />}
                          label={gender}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ width: 200 }}>Ngày sinh</Typography>
                    <Box sx={{ display: "flex", gap: 2, maxWidth: 500 }}>
                      <TextField
                        select
                        fullWidth
                        value={formData.birthDate.day}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            birthDate: {
                              ...formData.birthDate,
                              day: e.target.value,
                            },
                          })
                        }
                        SelectProps={{ native: true }}
                      >
                        <option value="">Ngày</option>
                        {[...Array(31)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </TextField>
                      <TextField
                        select
                        fullWidth
                        value={formData.birthDate.month}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            birthDate: {
                              ...formData.birthDate,
                              month: e.target.value,
                            },
                          })
                        }
                        SelectProps={{ native: true }}
                      >
                        <option value="">Tháng</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </TextField>
                      <TextField
                        select
                        fullWidth
                        value={formData.birthDate.year}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            birthDate: {
                              ...formData.birthDate,
                              year: e.target.value,
                            },
                          })
                        }
                        SelectProps={{ native: true }}
                      >
                        <option value="">Năm</option>
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
      case "address":
        return <AddressSection />;
      case "bank":
        return renderBankContent();
      case "password":
        return (
          <Box sx={{ width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Đổi mật khẩu
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
              Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người
              khác
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handlePasswordChange}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ width: 200 }}>
                      Mật khẩu hiện tại
                    </Typography>
                    <TextField
                      type="password"
                      fullWidth
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
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
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      required
                      sx={{ maxWidth: 500 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ width: 200 }}>
                      Xác nhận mật khẩu mới
                    </Typography>
                    <TextField
                      type="password"
                      fullWidth
                      value={passwordForm.confirmNewPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmNewPassword: e.target.value,
                        })
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
        pb: 4,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "280px" },
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              position: { md: "sticky" },
              top: "88px",
              width: "100%",
              zIndex: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
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
                      color: "text.secondary",
                    }}
                  >
                    Chọn Ảnh
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {[
                  { id: "profile", label: "Hồ Sơ" },
                  { id: "bank", label: "Ngân Hàng" },
                  { id: "address", label: "Địa Chỉ" },
                  { id: "password", label: "Đổi Mật Khẩu" },
                ].map((item) => (
                  <Typography
                    key={item.id}
                    component="div"
                    onClick={() => handleSectionChange(item.id)}
                    sx={{
                      p: 1,
                      cursor: "pointer",
                      borderRadius: 1,
                      bgcolor:
                        activeSection === item.id ? "black" : "transparent",
                      color: activeSection === item.id ? "white" : "inherit",
                      "&:hover": {
                        bgcolor:
                          activeSection === item.id ? "black" : "action.hover",
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

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              width: "828px",
            }}
          >
            <Box
              sx={{
                width: "100%",
                p: 3,
              }}
            >
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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountSetting;
