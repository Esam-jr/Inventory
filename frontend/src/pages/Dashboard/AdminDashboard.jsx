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
  Chip,
  Alert,
  Grow,
  useTheme,
} from "@mui/material";

import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  RequestQuote as RequisitionIcon,
  Assessment as ReportIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
  CheckCircle,
} from "@mui/icons-material";
import { useDashboardStats, useItems } from "../../services/queries";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();
  const { data: items } = useItems();

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <Alert severity="error">
        Error loading dashboard data: {error.message}
      </Alert>
    );

  const lowStockItems =
    items?.filter((item) => item.quantity <= item.minQuantity) || [];
  const recentActivity = stats?.recentActivity || [];

  const StatCard = ({ title, value, icon, color = "primary" }) => {
    const theme = useTheme();

    return (
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardContent
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 600,
                letterSpacing: 1,
                color: theme.palette.text.secondary,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: 700, mt: 0.5 }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: `${color}.light`,
              color: theme.palette[color].main,
              borderRadius: "50%",
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}
          >
            {icon}
          </Box>
        </CardContent>
      </Card>
    );
  };

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
      <Typography variant="body2" color="textSecondary" paragraph>
        {description}
      </Typography>
      <Button variant="outlined" size="small" onClick={action}>
        Take Action
      </Button>
    </Paper>
  );

  return (
    <Box>
      {/* Statistics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grow in={true} timeout={500}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={<PeopleIcon fontSize="inherit" />}
              color="primary"
            />
          </Grid>
        </Grow>

        <Grow in={true} timeout={700}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Inventory Items"
              value={stats?.totalItems || 0}
              icon={<InventoryIcon fontSize="inherit" />}
              color="secondary"
            />
          </Grid>
        </Grow>

        <Grow in={true} timeout={900}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Requisitions"
              value={stats?.requisitions?.total || 0}
              icon={<RequisitionIcon fontSize="inherit" />}
              color="info"
            />
          </Grid>
        </Grow>

        <Grow in={true} timeout={1100}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Low Stock Items"
              value={lowStockItems?.length || 0}
              icon={<WarningIcon fontSize="inherit" />}
              color="error"
            />
          </Grid>
        </Grow>
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
                  action={() => console.log("Navigate to users")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <QuickAction
                  title="View Reports"
                  description="Generate system reports and analytics"
                  icon={<ReportIcon />}
                  action={() => console.log("Navigate to reports")}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <QuickAction
                  title="System Settings"
                  description="Configure system preferences"
                  icon={<TrendingIcon />}
                  action={() => console.log("Navigate to settings")}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid sx={{ display: "flex", gap: 1.5 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List dense>
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <ListItem
                    key={index}
                    divider={index < recentActivity.length - 1}
                  >
                    <ListItemText
                      primary={activity.title || "Unknown Activity"}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            By: {activity.createdBy || "Unknown User"}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {activity.createdAt
                              ? new Date(
                                  activity.createdAt
                                ).toLocaleDateString()
                              : "Unknown date"}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
                {recentActivity.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No recent activity"
                      secondary="Activity will appear here as users interact with the system"
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Chip
                    label="Online"
                    color="success"
                    icon={!isLoading ? <CheckCircle size={16} /> : undefined}
                  />
                  <Typography variant="body2">API Status</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Chip
                    label="Connected"
                    color="success"
                    icon={!isLoading ? <CheckCircle size={16} /> : undefined}
                  />
                  <Typography variant="body2">Database</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Chip
                    label={
                      lowStockItems.length > 0 ? "Attention Needed" : "Healthy"
                    }
                    color={lowStockItems.length > 0 ? "warning" : "success"}
                    icon={!isLoading ? <CheckCircle size={16} /> : undefined}
                  />
                  <Typography variant="body2">Inventory Health</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Chip
                    label="Operational"
                    color="success"
                    icon={!isLoading ? <CheckCircle size={16} /> : undefined}
                  />
                  <Typography variant="body2">System Status</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {lowStockItems.length > 0 && (
        <Paper sx={{ p: 3, mt: 3, backgroundColor: "warning.light" }}>
          <Typography variant="h6" gutterBottom color="warning.dark">
            <WarningIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            Low Stock Alert
          </Typography>
          <Typography variant="body2" color="warning.dark">
            {lowStockItems.length} item(s) are below minimum stock levels and
            need restocking.
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => console.log("Navigate to low stock items")}
          >
            View Low Stock Items
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default AdminDashboard;
