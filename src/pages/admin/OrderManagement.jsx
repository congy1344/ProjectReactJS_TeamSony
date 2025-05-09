import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility, Edit } from "@mui/icons-material"; // Thay Delete bằng Edit
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../api/api";

const OrderManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);

  useEffect(() => {
    // Thêm console.log để debug
    console.log("OrderManagement mounted");
    console.log("User:", user);
    console.log("Is admin:", isAdmin());

    if (!user) {
      console.log("No user, redirecting to login");
      navigate("/login");
      return;
    }

    if (!isAdmin()) {
      console.log("Not admin, redirecting to home");
      navigate("/");
      return;
    }

    fetchOrders();
  }, [user, isAdmin, navigate]);

  const fetchOrders = async () => {
    try {
      const BASE_URL = api.getBaseUrl();
      console.log("Fetching orders from:", BASE_URL);
      const response = await axios.get(`${BASE_URL}/users`);
      console.log("Users response:", response.data);

      const allOrders = response.data.reduce((acc, user) => {
        if (user.orders) {
          return [
            ...acc,
            ...user.orders.map((order) => ({
              ...order,
              userName: user.name,
              userEmail: user.email,
            })),
          ];
        }
        return acc;
      }, []);

      console.log("Processed orders:", allOrders);
      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setStatusDialog(true);
  };

  const handleStatusChange = async (event) => {
    try {
      const newStatus = event.target.value;
      const BASE_URL = api.getBaseUrl();
      const userResponse = await axios.get(`${BASE_URL}/users`);
      const users = userResponse.data;

      // Find user and update order status
      const user = users.find((u) =>
        u.orders?.some((o) => o.id === selectedOrder.id)
      );
      if (user) {
        const updatedOrders = user.orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: newStatus }
            : order
        );

        await axios.put(`${BASE_URL}/users/${user.id}`, {
          ...user,
          orders: updatedOrders,
        });

        fetchOrders();
        setStatusDialog(false);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "In Transit":
        return "info";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 4,
        px: 3,
        mt: "64px",
        width: "100vw",
        maxWidth: "100vw !important",
        height: "calc(100vh - 64px)",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            m: 0,
          }}
        >
          Order Management
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1a1a1a" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Order ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Customer
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Total
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  <Typography variant="body2">{order.userName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.userEmail}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>{order.total.toLocaleString("vi-VN")}₫</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleViewDetails(order)}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEditStatus(order)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Order #{selectedOrder.id}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Customer Information
              </Typography>
              <Typography>
                Name: {selectedOrder.shippingAddress.fullName}
              </Typography>
              <Typography>
                Phone: {selectedOrder.shippingAddress.phone}
              </Typography>
              <Typography>
                Address: {selectedOrder.shippingAddress.address},{" "}
                {selectedOrder.shippingAddress.city}
              </Typography>

              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                Products
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography variant="body2">{item.name}</Typography>
                          {item.color && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Color: {item.color}
                            </Typography>
                          )}
                          {item.dimension && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Dimension: {item.dimension}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {item.price.toLocaleString("vi-VN")}₫
                        </TableCell>
                        <TableCell align="right">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          ₫
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <strong>Total:</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>
                          {selectedOrder.total.toLocaleString("vi-VN")}₫
                        </strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Status Edit Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedOrder?.status || ""}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Transit">In Transit</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderManagement;
