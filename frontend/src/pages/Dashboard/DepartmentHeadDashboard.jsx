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
  Avatar,
  Divider,
} from "@mui/material";
import {
  RequestQuote as RequisitionIcon,
  Assignment as RequestIcon,
  Group as TeamIcon,
  CheckCircle as ApprovedIcon,
  Schedule as PendingIcon,
} from "@mui/icons-material";
import { useDashboardStats } from "../../services/queries";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const DepartmentHeadDashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading dashboard data</div>;

  const myRequests = stats?.myRequests || {};

  return (
    <Box>
      {/* Department Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <RequisitionIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {(myRequests.requisitions?.length || 0) +
                  (myRequests.serviceRequests?.length || 0)}
              </Typography>
              <Typography color="textSecondary">Total Requests</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <ApprovedIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {myRequests.requisitions?.filter((r) => r.status === "APPROVED")
                  .length || 0}
              </Typography>
              <Typography color="textSecondary">Approved</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <PendingIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {myRequests.requisitions?.filter((r) => r.status === "PENDING")
                  .length || 0}
              </Typography>
              <Typography color="textSecondary">Pending</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <TeamIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {stats?.departmentInfo?.totalMembers || 0}
              </Typography>
              <Typography color="textSecondary">Team Members</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* My Requests */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              My Recent Requests
            </Typography>

            {/* Requisitions */}
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 2, mb: 1 }}
            >
              Requisitions
            </Typography>
            <List>
              {myRequests.requisitions?.slice(0, 3).map((req, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={req.title}
                    secondary={`${req.items} items • ${new Date(
                      req.createdAt
                    ).toLocaleDateString()}`}
                  />
                  <Chip
                    label={req.status}
                    size="small"
                    color={
                      req.status === "APPROVED"
                        ? "success"
                        : req.status === "PENDING"
                        ? "warning"
                        : "default"
                    }
                  />
                </ListItem>
              ))}
            </List>

            {/* Service Requests */}
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 3, mb: 1 }}
            >
              Service Requests
            </Typography>
            <List>
              {myRequests.serviceRequests?.slice(0, 3).map((req, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={req.title}
                    secondary={new Date(req.createdAt).toLocaleDateString()}
                  />
                  <Chip
                    label={req.status}
                    size="small"
                    color={
                      req.status === "APPROVED"
                        ? "success"
                        : req.status === "PENDING"
                        ? "warning"
                        : "default"
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Button
              variant="contained"
              startIcon={<RequestIcon />}
              sx={{ mt: 2 }}
            >
              Create New Request
            </Button>
          </Paper>
        </Grid>

        {/* Team & Quick Actions */}
        <Grid item xs={12} md={4}>
          {/* Department Info */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Department Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {stats?.departmentInfo?.name}
            </Typography>
            <Typography variant="body2">
              <strong>{stats?.departmentInfo?.totalMembers}</strong> team
              members
            </Typography>
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Button variant="outlined" startIcon={<RequestIcon />} fullWidth>
                New Requisition
              </Button>
              <Button variant="outlined" startIcon={<RequestIcon />} fullWidth>
                New Service Request
              </Button>
              <Button variant="outlined" startIcon={<TeamIcon />} fullWidth>
                View Team
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepartmentHeadDashboard;
