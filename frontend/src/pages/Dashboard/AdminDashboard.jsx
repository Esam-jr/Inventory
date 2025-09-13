import {
  Box,
  Paper,
  Typography,
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
  const theme = useTheme();

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

  const StatCard = ({ title, value, icon, color = "primary" }) => (
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
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
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
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}
    >
      {/* Statistics Overview */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }}
        gap={3}
      >
        <Grow in timeout={500}>
          <Box>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={<PeopleIcon fontSize="inherit" />}
              color="primary"
            />
          </Box>
        </Grow>
        <Grow in timeout={700}>
          <Box>
            <StatCard
              title="Inventory Items"
              value={stats?.totalItems || 0}
              icon={<InventoryIcon fontSize="inherit" />}
              color="secondary"
            />
          </Box>
        </Grow>
        <Grow in timeout={900}>
          <Box>
            <StatCard
              title="Requisitions"
              value={stats?.requisitions?.total || 0}
              icon={<RequisitionIcon fontSize="inherit" />}
              color="info"
            />
          </Box>
        </Grow>
        <Grow in timeout={1100}>
          <Box>
            <StatCard
              title="Low Stock Items"
              value={lowStockItems?.length || 0}
              icon={<WarningIcon fontSize="inherit" />}
              color="error"
            />
          </Box>
        </Grow>
      </Box>

      {/* Quick Actions */}
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, textTransform: "uppercase" }}
        >
          Quick Actions
        </Typography>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          }}
          gap={2}
        >
          <QuickAction
            title="Manage Users"
            description="Add, edit, or remove system users"
            icon={<PeopleIcon />}
            action={() => console.log("Navigate to users")}
          />
          <QuickAction
            title="View Reports"
            description="Generate system reports and analytics"
            icon={<ReportIcon />}
            action={() => console.log("Navigate to reports")}
          />
          <QuickAction
            title="System Settings"
            description="Configure system preferences"
            icon={<TrendingIcon />}
            action={() => console.log("Navigate to settings")}
          />
        </Box>
      </Paper>

      {/* Recent Activity and System Status */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }}
        gap={3}
      >
        {/* Recent Activity */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <List dense>
            {recentActivity.slice(0, 5).map((activity, index) => (
              <ListItem key={index} divider={index < recentActivity.length - 1}>
                <ListItemText
                  primary={activity.title || "Unknown Activity"}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        By: {activity.createdBy || "Unknown User"}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {activity.createdAt
                          ? new Date(activity.createdAt).toLocaleDateString()
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

        {/* System Status */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr 1fr", md: "repeat(4, 1fr)" }}
            gap={2}
          >
            <Box textAlign="center">
              <Chip
                label="Online"
                color="success"
                icon={!isLoading ? <CheckCircle size={16} /> : undefined}
              />
              <Typography variant="body2">API Status</Typography>
            </Box>
            <Box textAlign="center">
              <Chip
                label="Connected"
                color="success"
                icon={!isLoading ? <CheckCircle size={16} /> : undefined}
              />
              <Typography variant="body2">Database</Typography>
            </Box>
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
            <Box textAlign="center">
              <Chip
                label="Operational"
                color="success"
                icon={!isLoading ? <CheckCircle size={16} /> : undefined}
              />
              <Typography variant="body2">System Status</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Paper sx={{ p: 3, backgroundColor: "warning.light" }}>
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
