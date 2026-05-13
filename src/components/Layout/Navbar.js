import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const authLinks = [
    { label: 'Dashboard', to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'Tasks', to: '/tasks' },
  ];

  if (user?.role === 'admin' || user?.role === 'manager') {
    authLinks.push({ label: 'Admin', to: '/admin' });
  }

  const guestLinks = (
    <>
      <Button color="inherit" component={Link} to="/login">
        Login
      </Button>
      <Button color="inherit" component={Link} to="/register">
        Register
      </Button>
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Project Management
        </Typography>
        {isAuthenticated ? (
          <>
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  edge="end"
                  onClick={handleMenuOpen}
                  aria-label="open navigation menu"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {authLinks.map((link) => (
                    <MenuItem
                      key={link.to}
                      component={Link}
                      to={link.to}
                      onClick={handleMenuClose}
                    >
                      {link.label}
                    </MenuItem>
                  ))}
                  <MenuItem disabled>
                    Welcome, {user?.name} ({user?.role})
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      onLogout();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {authLinks.map((link) => (
                  <Button key={link.to} color="inherit" component={Link} to={link.to}>
                    {link.label}
                  </Button>
                ))}
                <Typography variant="body1" sx={{ ml: 2, mr: 2 }}>
                  Welcome, {user?.name} ({user?.role})
                </Typography>
                <Button color="inherit" onClick={onLogout}>
                  Logout
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;