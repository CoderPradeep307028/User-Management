import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Button,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const UserDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get('/api/projects'),
          api.get('/api/tasks'),
        ]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
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

  const myTasks = tasks.filter(task => task.assignedTo?._id === user?._id);
  const activeProjects = projects.filter(p => p.status === 'active');
  const completedTasks = myTasks.filter(t => t.status === 'done');

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Welcome back, {user?.name}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                My Tasks
              </Typography>
              <Typography variant="h4">{myTasks.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Projects
              </Typography>
              <Typography variant="h4">{activeProjects.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed Tasks
              </Typography>
              <Typography variant="h4">{completedTasks.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Tasks
              </Typography>
              <Typography variant="h4">{myTasks.filter(t => t.status !== 'done').length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">My Recent Tasks</Typography>
                <Button component={Link} to="/tasks" size="small">
                  View All
                </Button>
              </Box>
              {myTasks.slice(0, 5).map((task) => (
                <Box key={task._id} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                  <Typography variant="subtitle1">{task.title}</Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {task.description}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Chip
                      label={task.status}
                      size="small"
                      color={
                        task.status === 'done' ? 'success' :
                        task.status === 'in-progress' ? 'warning' :
                        task.status === 'review' ? 'info' : 'default'
                      }
                    />
                    <Chip
                      label={task.priority}
                      size="small"
                      color={
                        task.priority === 'high' ? 'error' :
                        task.priority === 'medium' ? 'warning' : 'success'
                      }
                    />
                  </Box>
                </Box>
              ))}
              {myTasks.length === 0 && (
                <Typography color="textSecondary">No tasks assigned yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Active Projects</Typography>
                <Button component={Link} to="/projects" size="small">
                  View All
                </Button>
              </Box>
              {activeProjects.slice(0, 3).map((project) => (
                <Box key={project._id} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                  <Typography variant="subtitle1">{project.name}</Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {project.description}
                  </Typography>
                  <Chip
                    label={project.status}
                    size="small"
                    color="success"
                  />
                </Box>
              ))}
              {activeProjects.length === 0 && (
                <Typography color="textSecondary">No active projects.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard;