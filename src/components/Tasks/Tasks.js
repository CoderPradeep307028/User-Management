import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import api from '../../utils/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/api/tasks'),
        api.get('/api/projects'),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ title: '', description: '', project: '', priority: 'medium' });
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/tasks', formData);
      fetchData();
      handleClose();
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'default';
      case 'in-progress':
        return 'warning';
      case 'review':
        return 'info';
      case 'done':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add Task
        </Button>
      </Box>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  {task.description}
                </Typography>
                <Box display="flex" gap={1} mb={1}>
                  <Chip
                    label={task.status}
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2">
                  Project: {task.project.name}
                </Typography>
                {task.assignedTo && (
                  <Typography variant="body2">
                    Assigned to: {task.assignedTo.name}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small">Edit</Button>
                <Button size="small">Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Task Title"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={onChange}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={formData.description}
              onChange={onChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="project-label">Project</InputLabel>
              <Select
                labelId="project-label"
                name="project"
                value={formData.project}
                label="Project"
                onChange={onChange}
                required
              >
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                name="priority"
                value={formData.priority}
                label="Priority"
                onChange={onChange}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Tasks;