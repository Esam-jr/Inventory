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
  RequestQuote as RequisitionIcon,
} from "@mui/icons-material";
import { useDashboardStats, useRequisitions } from "../../services/queries";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const StorekeeperDashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading, error } = useDashboardStats();
  const { data: approvedReqs } = useRequisitions({ status: "APPROVED" });

  if (isLoading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <div>Error loading dashboard data: {error.message}</div>;

  const lowStockItems = stats?.lowStockItems || stats?.inventory?.lowStockItems || [];
  const totalItems = stats?.inventorySummary?.totalItems ?? stats?.itemsCount ?? stats?.inventory?.total ?? 0;
  const lowStockCount = stats?.inventorySummary?.lowStockCount ?? lowStockItems.length;
  const inStockCount = totalItems - lowStockCount;
  const recentTx = stats?.transactions?.recent || stats?.recentTransactions || stats?.recentActivity || [];

  const getTypeColor = (type) => {
    const map = { RECEIVE: "success", ISSUE: "error", ADJUST: "warning" };
    return map[type] || "default";
  };

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
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center" }}>
                    <InventoryIcon
                      color="primary"
                      sx={{ fontSize: 40, mb: 1 }}
                    />
                    <Typography variant="h4">{totalItems}</Typography>
                    <Typography color="text.secondary">Total Items</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center" }}>
                    <WarningIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{lowStockCount}</Typography>
                    <Typography color="text.secondary">Low Stock</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center" }}>
                    <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{inStockCount}</Typography>
                    <Typography color="text.secondary">In Stock</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center" }}>
                    <RequisitionIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{approvedReqs?.length || 0}</Typography>
                    <Typography color="text.secondary">Approved Requisitions</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Button variant="contained" startIcon={<InventoryIcon />} onClick={() => navigate("/inventory")}>
              View Full Inventory
            </Button>
          </Paper>

          {/* Recent Transactions */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <List>
              {recentTx.slice(0, 5).map((tx, index) => {
                const name = tx.item?.name || tx.itemName || tx.item || "Unknown item";
                const unit = tx.item?.unit || tx.unit || "";
                const qty = Math.abs(tx.quantity ?? 0);
                const type = tx.type || tx.actionType || "N/A";
                const date = tx.createdAt || tx.date;
                return (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={name}
                      secondary={`${qty} ${unit} • ${type} • ${date ? new Date(date).toLocaleDateString() : ""}`}
                    />
                    <Chip label={type} size="small" color={getTypeColor(type)} />
                  </ListItem>
                );
              })}
              {recentTx.length === 0 && (
                <ListItem>
                  <ListItemText primary="No recent transactions" />
                </ListItem>
              )}
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
              <Button variant="outlined" startIcon={<ShippingIcon />} fullWidth onClick={() => navigate("/transactions")}>
                Receive Stock
              </Button>
              <Button
                variant="outlined"
                startIcon={<InventoryIcon />}
                fullWidth
                onClick={() => navigate("/transactions")}
              >
                Issue Items
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate("/inventory/stats")}>
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
                {lowStockItems.slice(0, 5).map((it, index) => {
                  const name = it.name || it.itemName || "Unknown item";
                  const current = it.quantity ?? it.currentQuantity ?? 0;
                  const min = it.minQuantity ?? it.minimumQuantity ?? 0;
                  const unit = it.unit || "";
                  return (
                    <ListItem
                      key={index}
                      divider={index < lowStockItems.length - 1}
                    >
                      <ListItemText
                        primary={name}
                        secondary={`Current: ${current} ${unit} | Min: ${min} ${unit}`}
                      />
                      <Chip
                        label="LOW"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    </ListItem>
                  );
                })}
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
