import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import api from '../../utils/api';

const AdminReports = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    activeProjects: 0,
    completedProjects: 0,
    taskStatus: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const [usersRes, projectsRes, tasksRes] = await Promise.all([
          api.get('/api/auth/admin/users'),
          api.get('/api/projects'),
          api.get('/api/tasks'),
        ]);

        const projects = projectsRes.data;
        const tasks = tasksRes.data;

        const taskStatus = tasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalUsers: usersRes.data.length,
          totalProjects: projects.length,
          totalTasks: tasks.length,
          activeProjects: projects.filter((project) => project.status === 'active').length,
          completedProjects: projects.filter((project) => project.status === 'completed').length,
          taskStatus,
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchReport();
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
        Admin Reports
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
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
                Completed Projects
              </Typography>
              <Typography variant="h4">{stats.completedProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Status Breakdown
              </Typography>
              <List>
                {Object.keys(stats.taskStatus).length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No tasks available." />
                  </ListItem>
                ) : (
                  Object.entries(stats.taskStatus).map(([status, count]) => (
                    <ListItem key={status}>
                      <ListItemText primary={`${status}: ${count}`} />
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Typography>
                This report gives you an overview of active and completed projects, along with task status totals.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminReports;
