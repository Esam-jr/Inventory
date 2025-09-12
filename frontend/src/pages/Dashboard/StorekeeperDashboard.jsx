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
  Chip,
  Alert,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  LocalShipping as ShippingIcon,
} from "@mui/icons-material";
import { useDashboardStats } from "../../services/queries";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const StorekeeperDashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading dashboard data</div>;

  const lowStockItems = stats?.lowStockItems || [];

  return (
    <Box>
      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>Attention:</strong> {lowStockItems.length} item(s) are low on
          stock and need restocking.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Inventory Overview */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Inventory Overview
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center" }}>
                    <InventoryIcon
                      color="primary"
                      sx={{ fontSize: 40, mb: 1 }}
                    />
                    <Typography variant="h4">
                      {stats?.inventorySummary?.totalItems || 0}
                    </Typography>
                    <Typography color="textSecondary">Total Items</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center" }}>
                    <WarningIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">
                      {stats?.inventorySummary?.lowStockCount || 0}
                    </Typography>
                    <Typography color="textSecondary">Low Stock</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center" }}>
                    <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">
                      {(stats?.inventorySummary?.totalItems || 0) -
                        (stats?.inventorySummary?.lowStockCount || 0)}
                    </Typography>
                    <Typography color="textSecondary">In Stock</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Button variant="contained" startIcon={<InventoryIcon />}>
              View Full Inventory
            </Button>
          </Paper>

          {/* Recent Transactions */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <List>
              {stats?.recentActivity?.slice(0, 5).map((transaction, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={transaction.item}
                    secondary={`${transaction.quantity} ${transaction.unit} • ${
                      transaction.type
                    } • ${new Date(
                      transaction.createdAt
                    ).toLocaleDateString()}`}
                  />
                  <Chip
                    label={transaction.type}
                    size="small"
                    color={
                      transaction.type === "RECEIVE" ? "success" : "primary"
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions & Low Stock */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Button variant="outlined" startIcon={<ShippingIcon />} fullWidth>
                Receive Stock
              </Button>
              <Button
                variant="outlined"
                startIcon={<InventoryIcon />}
                fullWidth
              >
                Issue Items
              </Button>
              <Button variant="outlined" fullWidth>
                Stock Count
              </Button>
            </Box>
          </Paper>

          {/* Low Stock Alert */}
          {lowStockItems.length > 0 && (
            <Paper sx={{ p: 3, bgcolor: "warning.light" }}>
              <Typography variant="h6" gutterBottom color="warning.dark">
                <WarningIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Low Stock Items
              </Typography>
              <List dense>
                {lowStockItems.slice(0, 5).map((item, index) => (
                  <ListItem
                    key={index}
                    divider={index < lowStockItems.length - 1}
                  >
                    <ListItemText
                      primary={item.itemName}
                      secondary={`Current: ${item.currentQuantity} | Min: ${item.minQuantity} ${item.unit}`}
                    />
                    <Chip
                      label="LOW"
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
              {lowStockItems.length > 5 && (
                <Typography variant="body2" color="warning.dark" sx={{ mt: 1 }}>
                  +{lowStockItems.length - 5} more items...
                </Typography>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default StorekeeperDashboard;
