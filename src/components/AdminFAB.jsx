import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  People,
  ShoppingBasket,
  AdminPanelSettings,
} from '@mui/icons-material';

const AdminFAB = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user || !isAdmin()) {
    return null;
  }

  const actions = [
    { icon: <ShoppingBasket />, name: 'Quản lý sản phẩm', route: '/admin/products' },
    { icon: <Dashboard />, name: 'Quản lý đơn hàng', route: '/admin/orders' },
    { icon: <People />, name: 'Quản lý người dùng', route: '/admin/users' },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',  // Changed from 'absolute' to 'fixed'
        bottom: 16,
        right: 16,
        zIndex: 1000,      // Increased z-index to ensure it stays on top
      }}
    >
      <SpeedDial
        ariaLabel="Admin SpeedDial"
        icon={<SpeedDialIcon icon={<AdminPanelSettings />} />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        direction="up"
        FabProps={{
          sx: {
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          },
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={
              <Tooltip title={action.name} placement="left">
                {action.icon}
              </Tooltip>
            }
            tooltipTitle={action.name}
            onClick={() => {
              navigate(action.route);
              setOpen(false);
            }}
            FabProps={{
              sx: {
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'grey.200',
                },
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default AdminFAB;