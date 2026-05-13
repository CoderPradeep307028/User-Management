import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import AdminDashboard from '../Dashboard/AdminDashboard';
import UserDashboard from '../Dashboard/UserDashboard';

const RoleBasedDashboard = () => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Show admin dashboard for admin and manager roles
  if (user?.role === 'admin' || user?.role === 'manager') {
    return <AdminDashboard />;
  }

  // Show user dashboard for regular users
  return <UserDashboard />;
};

export default RoleBasedDashboard;