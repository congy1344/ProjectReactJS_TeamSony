import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
  CardContent,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api/api";

const AddressSection = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detail: "",
    type: "home",
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const BASE_URL = api.getBaseUrl();
        const response = await axios.get(`${BASE_URL}/users/${user.id}`);
        setAddresses(response.data.addresses || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "/data/full_json_generated_data_vn_units.json"
        );
        const data = await response.json();
        // Sắp xếp provinces theo tên
        const sortedProvinces = [...data].sort((a, b) =>
          a.Name.localeCompare(b.Name, "vi")
        );
        setProvinces(sortedProvinces);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchAddresses();
    fetchProvinces();
  }, [user.id]);

  const handleProvinceChange = (event) => {
    const provinceCode = event.target.value;
    const selectedProv = provinces.find((p) => p.Code === provinceCode);
    setSelectedProvince(selectedProv);
    setFormData({
      ...formData,
      province: provinceCode,
      provinceName: selectedProv.Name,
      district: "",
      districtName: "",
      ward: "",
      wardName: "",
    });
    // Sắp xếp districts theo tên
    const sortedDistricts = [...(selectedProv?.District || [])].sort((a, b) =>
      a.Name.localeCompare(b.Name, "vi")
    );
    setDistricts(sortedDistricts);
    setWards([]);
  };

  const handleDistrictChange = (event) => {
    const districtCode = event.target.value;
    const selectedDist = districts.find((d) => d.Code === districtCode);
    setSelectedDistrict(selectedDist);
    setFormData({
      ...formData,
      district: districtCode,
      districtName: selectedDist.Name,
      ward: "",
      wardName: "",
    });
    // Sắp xếp wards theo tên
    const sortedWards = [...(selectedDist?.Ward || [])].sort((a, b) =>
      a.Name.localeCompare(b.Name, "vi")
    );
    setWards(sortedWards);
  };

  const handleWardChange = (event) => {
    const wardCode = event.target.value;
    const selectedWard = wards.find((w) => w.Code === wardCode);
    setFormData({
      ...formData,
      ward: wardCode,
      wardName: selectedWard.Name,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên";
    if (!formData.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^0\d{9,10}$/.test(formData.phone.trim())) {
      errors.phone = "Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)";
    }
    if (!formData.province) errors.province = "Chọn tỉnh/thành phố";
    if (!formData.district) errors.district = "Chọn quận/huyện";
    if (!formData.ward) errors.ward = "Chọn phường/xã";
    if (!formData.detail.trim()) errors.detail = "Vui lòng nhập địa chỉ cụ thể";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError("");
    if (!validateForm()) return;
    try {
      const BASE_URL = api.getBaseUrl();
      // Tạo địa chỉ mới
      const newAddress = {
        id: Date.now().toString(),
        userId: user.id,
        ...formData,
      };
      // Lấy thông tin user hiện tại
      const userResponse = await axios.get(
        `${BASE_URL}/users/${user.id}`
      );
      const currentUser = userResponse.data;
      // Cập nhật danh sách địa chỉ
      let updatedAddresses = [...(currentUser.addresses || [])];
      if (formData.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));
      }
      updatedAddresses.push(newAddress);
      // Cập nhật thông tin user với địa chỉ mới
      await axios.patch(`${BASE_URL}/users/${user.id}`, {
        addresses: updatedAddresses,
      });
      setAddresses(updatedAddresses);
      setOpen(false);
      setFormData({
        fullName: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        detail: "",
        type: "home",
        isDefault: false,
      });
      setFormErrors({});
    } catch (error) {
      setSaveError("Không thể lưu địa chỉ. Vui lòng kiểm tra kết nối hoặc thử lại sau.");
      console.error("Error saving address:", error);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const userResponse = await axios.get(
        `http://localhost:3001/users/${user.id}`
      );
      const currentUser = userResponse.data;

      const updatedAddresses = currentUser.addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));

      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        addresses: updatedAddresses,
      });

      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  const handleDelete = async (addressId) => {
    try {
      const userResponse = await axios.get(
        `http://localhost:3001/users/${user.id}`
      );
      const currentUser = userResponse.data;

      const updatedAddresses = currentUser.addresses.filter(
        (addr) => addr.id !== addressId
      );

      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        addresses: updatedAddresses,
      });

      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Địa chỉ của tôi
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Quản lý địa chỉ giao hàng
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: "black",
            color: "white",
            minWidth: 120,
            height: 36,
            "&:hover": {
              bgcolor: "black",
            },
          }}
        >
          Thêm địa chỉ mới
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {addresses.map((address) => (
          <Card
            key={address.id}
            sx={{
              boxShadow: "none",
              border: "1px solid",
              borderColor: "divider",
              width: "100%",
            }}
          >
            <CardContent sx={{ p: "24px !important" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1, maxWidth: 700 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {address.fullName}
                    </Typography>
                    {address.isDefault && (
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "black",
                          color: "white",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                        }}
                      >
                        Mặc định
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {address.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {address.detail}, {address.wardName}, {address.districtName}
                    , {address.provinceName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "inline-block",
                      border: "1px solid",
                      borderColor: "divider",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {address.type === "home" ? "Nhà riêng" : "Văn phòng"}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(address.id)}
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        color: "error.main",
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              {!address.isDefault && (
                <Button
                  sx={{
                    mt: 3,
                    color: "black",
                    borderColor: "black",
                    height: 36,
                    "&:hover": {
                      borderColor: "black",
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                  variant="outlined"
                  size="small"
                  onClick={() => handleSetDefault(address.id)}
                >
                  Thiết lập mặc định
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {addresses.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              px: 3,
              color: "text.secondary",
              bgcolor: "background.paper",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Typography>Bạn chưa có địa chỉ nào</Typography>
          </Box>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: "500px",
          },
        }}
      >
        <DialogTitle sx={{ px: 3, py: 2 }}>
          <Typography variant="h6">Thêm địa chỉ mới</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: "24px !important" }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  error={!!formErrors.fullName}
                  helperText={formErrors.fullName}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tỉnh/Thành phố</InputLabel>
                  <Select
                    value={formData.province}
                    onChange={handleProvinceChange}
                    label="Tỉnh/Thành phố"
                    required
                  >
                    {provinces.map((province) => (
                      <MenuItem key={province.Code} value={province.Code}>
                        {province.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Quận/Huyện</InputLabel>
                  <Select
                    value={formData.district}
                    onChange={handleDistrictChange}
                    label="Quận/Huyện"
                    required
                    disabled={!selectedProvince}
                  >
                    {districts.map((district) => (
                      <MenuItem key={district.Code} value={district.Code}>
                        {district.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Phường/Xã</InputLabel>
                  <Select
                    value={formData.ward}
                    onChange={handleWardChange}
                    label="Phường/Xã"
                    required
                    disabled={!selectedDistrict}
                  >
                    {wards.map((ward) => (
                      <MenuItem key={ward.Code} value={ward.Code}>
                        {ward.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ cụ thể"
                  value={formData.detail}
                  onChange={(e) =>
                    setFormData({ ...formData, detail: e.target.value })
                  }
                  required
                  placeholder="Số nhà, tên đường"
                  error={!!formErrors.detail}
                  helperText={formErrors.detail}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Loại địa chỉ:
                </Typography>
                <RadioGroup
                  row
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <FormControlLabel
                    value="home"
                    control={<Radio />}
                    label="Nhà riêng"
                  />
                  <FormControlLabel
                    value="office"
                    control={<Radio />}
                    label="Văn phòng"
                  />
                </RadioGroup>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.isDefault}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isDefault: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Đặt làm địa chỉ mặc định"
                />
              </Grid>
            </Grid>
            {saveError && (
              <Box sx={{ color: 'red', mt: 2, textAlign: 'center' }}>{saveError}</Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            sx={{
              minWidth: 100,
              height: 36,
              borderColor: "black",
              color: "black",
              "&:hover": {
                borderColor: "black",
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              minWidth: 100,
              height: 36,
              bgcolor: "black",
              color: "white",
              "&:hover": {
                bgcolor: "black",
              },
            }}
          >
            Hoàn thành
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressSection;
