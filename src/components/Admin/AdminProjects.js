import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import api from '../../utils/api';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/api/projects');
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'on-hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  const openConfirm = (project) => {
    setSelectedProject(project);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setSelectedProject(null);
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/projects/${selectedProject._id}`);
      setProjects(projects.filter((project) => project._id !== selectedProject._id));
      closeConfirm();
    } catch (err) {
      console.error(err);
    }
    setActionLoading(false);
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
      <Typography variant="h4" gutterBottom>
        Admin Project Management
      </Typography>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {project.name}
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 1 }}>
                  Owner: {project.owner?.name || project.owner?.email || 'N/A'}
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 1 }}>
                  Members: {project.members?.length || 0}
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  End date: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                </Typography>
                <Chip
                  label={project.status || 'active'}
                  color={getStatusColor(project.status)}
                  size="small"
                />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  onClick={() => openConfirm(project)}
                >
                  Delete Project
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={confirmOpen} onClose={closeConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the project "{selectedProject?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm} disabled={actionLoading}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" disabled={actionLoading}>
            {actionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProjects;
