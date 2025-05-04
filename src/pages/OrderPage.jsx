import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  styled,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemIcon,
  Divider,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from '../contexts/AuthContext';

const MenuListItem = styled(ListItem)(({ active }) => ({
  padding: '12px 24px',
  color: active ? '#000' : '#666',
  '&:hover': {
    backgroundColor: '#f5f5f5',
    cursor: 'pointer'
  }
}));

const OrderCard = styled(Box)({
  backgroundColor: '#fff',
  padding: '20px',
  marginBottom: '15px',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const AddressCard = styled(Paper)({
  backgroundColor: '#fff',
  padding: '24px',
  marginBottom: '12px',
  borderRadius: '4px',
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
  width: 'calc(100vw - 360px)', // Subtract sidebar width (280px) and padding (80px)
});

const OrderPage = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('orders');

  const renderSidebar = () => (
    <Box sx={{ 
      width: '280px', 
      backgroundColor: '#fff', 
      height: 'calc(100vh - 64px)',
      position: 'fixed',
      top: '64px',
      borderRight: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ 
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80,
            marginBottom: 2,
            bgcolor: '#f5f5f5',
            color: '#666'
          }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: '18px',
            marginBottom: '4px',
            fontWeight: '500'
          }}
        >
          {user?.name}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            fontSize: '14px'
          }}
        >
          {user?.email}
        </Typography>
      </Box>

      <List sx={{ width: '100%', padding: '16px 0' }}>
        <MenuListItem 
          active={activeSection === 'orders'}
          onClick={() => setActiveSection('orders')}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LocalShippingIcon color={activeSection === 'orders' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Đơn Hàng" />
        </MenuListItem>

        <MenuListItem 
          active={activeSection === 'addresses'}
          onClick={() => setActiveSection('addresses')}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <HomeIcon color={activeSection === 'addresses' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Địa Chỉ" />
        </MenuListItem>
      </List>
    </Box>
  );

  const renderOrders = () => (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
        MY ORDERS
      </Typography>
      <Typography variant="body2" sx={{ color: '#666', marginBottom: '30px' }}>
        ({user?.orders?.length || 0}) orders placed
      </Typography>

      {user?.orders?.map((order) => (
        <OrderCard key={order.id}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <Typography>
              Order #{order.id}
            </Typography>
            <Typography>
              Total: ${order.total}
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            {order.status === 'In Transit' ? (
              <>
                <LocalShippingIcon sx={{ color: '#999' }} />
                <Typography>
                  In Transit
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '14px', marginLeft: '5px' }}>
                  Ordered on {new Date(order.orderDate).toLocaleDateString()}
                </Typography>
              </>
            ) : (
              <>
                <CheckCircleIcon sx={{ color: '#4CAF50' }} />
                <Typography>
                  Delivered!
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '14px', marginLeft: '5px' }}>
                  Delivered on {new Date(order.deliveryDate).toLocaleDateString()}
                </Typography>
              </>
            )}
          </Box>
        </OrderCard>
      ))}
    </Box>
  );

  const renderAddresses = () => (
    <Box sx={{ width: '100%' }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: '600',
          fontSize: '28px',
          marginBottom: '5px' 
        }}
      >
        ADDRESS BOOK
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#666',
          marginBottom: '24px',
          fontSize: '14px'
        }}
      >
        ({user?.addresses?.length || 0}) saved addresses
      </Typography>

      <Box sx={{ 
        width: '100%',
      }}>
        {user?.addresses?.map((address) => (
          <AddressCard key={address.id}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: '500',
                    fontSize: '16px'
                  }}
                >
                  {address.fullName}
                </Typography>
                {address.isDefault && (
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '12px',
                      color: '#4CAF50',
                      backgroundColor: '#E8F5E9',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Default
                  </Typography>
                )}
              </Box>
              <Typography sx={{ color: '#666', fontSize: '14px' }}>
                {address.phone}
              </Typography>
            </Box>
            <Typography 
              sx={{ 
                color: '#666',
                fontSize: '14px',
                lineHeight: 1.5
              }}
            >
              {address.detail}, {address.wardName}, {address.districtName}, {address.provinceName}
            </Typography>
          </AddressCard>
        ))}
      </Box>
    </Box>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'addresses':
        return renderAddresses();
      default:
        return renderOrders();
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      backgroundColor: '#f5f5f5',
      minHeight: 'calc(100vh - 64px)',
      marginTop: '64px',
    }}>
      {renderSidebar()}
      <Box sx={{ 
        flex: 1, 
        padding: '40px',
        marginLeft: '280px',
        maxWidth: 'calc(100vw - 280px)',
        overflowX: 'hidden', // Prevent horizontal scroll
      }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default OrderPage;