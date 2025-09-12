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
  Divider,
} from "@mui/material";
import {
  RequestQuote as RequisitionIcon,
  Assignment as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  TrendingUp as StatsIcon,
} from "@mui/icons-material";
import { useDashboardStats } from "../../services/queries";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const ProcurementDashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading dashboard data</div>;

  const pendingRequisitions = stats?.pendingRequisitions || [];
  const pendingServiceRequests = stats?.pendingServiceRequests || [];

  return (
    <Box>
      {/* Approval Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <PendingIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {stats?.pendingApprovals?.requisitions || 0}
              </Typography>
              <Typography color="textSecondary">
                Pending Requisitions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <PendingIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {stats?.pendingApprovals?.serviceRequests || 0}
              </Typography>
              <Typography color="textSecondary">
                Pending Service Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <ApprovedIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {stats?.requisitions?.APPROVED || 0}
              </Typography>
              <Typography color="textSecondary">Approved This Month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <RejectedIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {stats?.requisitions?.REJECTED || 0}
              </Typography>
              <Typography color="textSecondary">Rejected This Month</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Requisitions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Pending Requisitions</Typography>
              <Chip
                label={`${pendingRequisitions.length} pending`}
                color="warning"
                size="small"
              />
            </Box>

            <List>
              {pendingRequisitions.slice(0, 5).map((req, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={req.title}
                    secondary={`${req.department} • ${
                      req.items
                    } items • ${new Date(req.createdAt).toLocaleDateString()}`}
                  />
                  <Button size="small" variant="outlined">
                    Review
                  </Button>
                </ListItem>
              ))}
            </List>

            {pendingRequisitions.length === 0 && (
              <Typography color="text.secondary" textAlign="center" py={3}>
                No pending requisitions
              </Typography>
            )}

            {pendingRequisitions.length > 0 && (
              <Button fullWidth variant="text" sx={{ mt: 2 }}>
                View All Requisitions
              </Button>
            )}
          </Paper>
        </Grid>

        {/* Pending Service Requests */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Pending Service Requests</Typography>
              <Chip
                label={`${pendingServiceRequests.length} pending`}
                color="info"
                size="small"
              />
            </Box>

            <List>
              {pendingServiceRequests.slice(0, 5).map((req, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={req.title}
                    secondary={`${req.department} • ${new Date(
                      req.createdAt
                    ).toLocaleDateString()}`}
                  />
                  <Button size="small" variant="outlined">
                    Review
                  </Button>
                </ListItem>
              ))}
            </List>

            {pendingServiceRequests.length === 0 && (
              <Typography color="text.secondary" textAlign="center" py={3}>
                No pending service requests
              </Typography>
            )}

            {pendingServiceRequests.length > 0 && (
              <Button fullWidth variant="text" sx={{ mt: 2 }}>
                View All Service Requests
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Decisions */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Decisions
        </Typography>
        <Grid container spacing={2}>
          {stats?.recentDecisions?.slice(0, 4).map((decision, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  bgcolor:
                    decision.status === "APPROVED"
                      ? "success.light"
                      : "error.light",
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {decision.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {decision.department} • {decision.processedBy}
                </Typography>
                <Chip
                  label={decision.status}
                  size="small"
                  color={decision.status === "APPROVED" ? "success" : "error"}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProcurementDashboard;
