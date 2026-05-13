import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    activeProjects: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, projectsRes, tasksRes] = await Promise.all([
          api.get('/api/auth/admin/users'),
          api.get('/api/projects'),
          api.get('/api/tasks'),
        ]);

        setStats({
          totalUsers: usersRes.data.length,
          totalProjects: projectsRes.data.length,
          totalTasks: tasksRes.data.length,
          activeProjects: projectsRes.data.filter(p => p.status === 'active').length,
        });

        // Get recent users (last 5)
        setRecentUsers(usersRes.data.slice(-5).reverse());
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Welcome back, {user?.name}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">{stats.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Projects
              </Typography>
              <Typography variant="h4">{stats.totalProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Projects
              </Typography>
              <Typography variant="h4">{stats.activeProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h4">{stats.totalTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Users
              </Typography>
              <List>
                {recentUsers.map((user, index) => (
                  <React.Fragment key={user._id}>
                    <ListItem>
                      <ListItemText
                        primary={user.name}
                        secondary={`${user.email} • ${user.role}`}
                      />
                    </ListItem>
                    {index < recentUsers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Admin Actions
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Button
                  component={Link}
                  to="/admin/users"
                  variant="contained"
                  color="primary"
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Manage Users
                </Button>
                <Button
                  component={Link}
                  to="/admin/settings"
                  variant="outlined"
                  color="primary"
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  System Settings
                </Button>
                <Button
                  component={Link}
                  to="/admin/reports"
                  variant="outlined"
                  color="secondary"
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  View Reports
                </Button>
                <Button
                  component={Link}
                  to="/admin/projects"
                  variant="outlined"
                  color="error"
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Delete Projects
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;