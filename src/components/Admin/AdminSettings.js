import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  Alert,
} from '@mui/material';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    defaultProjectStatus: 'active',
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (event) => {
    setSettings({ ...settings, [event.target.name]: event.target.checked });
    setSaved(false);
  };

  const handleChange = (event) => {
    setSettings({ ...settings, [event.target.name]: event.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={handleToggle}
                  name="maintenanceMode"
                />
              }
              label="Maintenance Mode"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allowRegistrations}
                  onChange={handleToggle}
                  name="allowRegistrations"
                />
              }
              label="Allow New Registrations"
            />
            <TextField
              select
              fullWidth
              SelectProps={{ native: true }}
              label="Default Project Status"
              name="defaultProjectStatus"
              value={settings.defaultProjectStatus}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </TextField>
            <Box>
              <Button variant="contained" onClick={handleSave}>
                Save Settings
              </Button>
            </Box>
            {saved && <Alert severity="success">Settings saved successfully.</Alert>}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminSettings;
