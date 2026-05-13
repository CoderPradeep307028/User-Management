import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Projects from './components/Projects/Projects';
import Tasks from './components/Tasks/Tasks';
import AdminUsers from './components/Admin/AdminUsers';
import AdminProjects from './components/Admin/AdminProjects';
import AdminSettings from './components/Admin/AdminSettings';
import AdminReports from './components/Admin/AdminReports';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/Routing/PrivateRoute';
import AdminRoute from './components/Routing/AdminRoute';
import RoleBasedDashboard from './components/Routing/RoleBasedDashboard';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<RoleBasedDashboard />} />
            <Route path="/projects" element={<PrivateRoute allowedRoles={['user', 'manager']}><Projects /></PrivateRoute>} />
            <Route path="/tasks" element={<PrivateRoute allowedRoles={['user', 'manager']}><Tasks /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;