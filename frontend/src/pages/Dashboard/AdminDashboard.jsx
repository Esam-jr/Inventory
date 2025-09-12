import { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from "@mui/material";
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  RequestQuote as RequisitionIcon,
  Assessment as ReportIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useDashboardStats } from "../../services/queries";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading dashboard data</div>;

  const StatCard = ({ title, value, icon, color = "primary" }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box color={`${color}.main`} fontSize="2.5rem">
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const QuickAction = ({ title, description, icon, action }) => (
    <Paper sx={{ p: 2, height: "100%" }}>
      <Box display="flex" alignItems="center" mb={1}>
        <Box mr={1} color="primary.main">
          {icon}
        </Box>
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>
      <Button variant="outlined" size="small">
        Take Action
      </Button>
    </Paper>
  );

  return (
    <Box>
      {/* Statistics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<PeopleIcon fontSize="inherit" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inventory Items"
            value={stats?.totalItems || 0}
            icon={<InventoryIcon fontSize="inherit" />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Requisitions"
            value={stats?.requisitions?.total || 0}
            icon={<RequisitionIcon fontSize="inherit" />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={stats?.lowStockItems?.length || 0}
            icon={<WarningIcon fontSize="inherit" />}
            color="error"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <QuickAction
                  title="Manage Users"
                  description="Add, edit, or remove system users"
                  icon={<PeopleIcon />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <QuickAction
                  title="View Reports"
                  description="Generate system reports and analytics"
                  icon={<Assessment as ReportIcon />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <QuickAction
                  title="Inventory Overview"
                  description="View and manage inventory items"
                  icon={<InventoryIcon />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <QuickAction
                  title="System Settings"
                  description="Configure system preferences"
                  icon={<TrendingIcon />}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List dense>
              {stats?.recentActivity?.slice(0, 5).map((activity, index) => (
                <ListItem key={index} divider={index < 4}>
                  <ListItemIcon>
                    <Chip
                      label={activity.status}
                      size="small"
                      color={
                        activity.status === "APPROVED"
                          ? "success"
                          : activity.status === "PENDING"
                          ? "warning"
                          : "default"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.title}
                    secondary={`By ${activity.createdBy} • ${new Date(
                      activity.createdAt
                    ).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* System Status */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          System Status
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Chip label="Online" color="success" />
              <Typography variant="body2">API Status</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Chip label="Connected" color="success" />
              <Typography variant="body2">Database</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Chip label="Active" color="success" />
              <Typography variant="body2">Email Service</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Chip label="Healthy" color="success" />
              <Typography variant="body2">System Health</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
