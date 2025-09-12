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
} from "@mui/material";
import {
  Assessment as ReportIcon,
  History as AuditIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useDashboardStats } from "../../services/queries";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const AuditorDashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading dashboard data</div>;

  return (
    <Box>
      {/* Audit Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <AuditIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {stats?.requisitions?.total || 0}
              </Typography>
              <Typography color="textSecondary">Total Requisitions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <AuditIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {stats?.serviceRequests?.total || 0}
              </Typography>
              <Typography color="textSecondary">Service Requests</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <ReportIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {stats?.transactions?.total || 0}
              </Typography>
              <Typography color="textSecondary">Transactions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <DownloadIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">0</Typography>
              <Typography color="textSecondary">Reports Generated</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Audit Trail Overview
            </Typography>
            <List>
              {stats?.recentActivity?.slice(0, 10).map((activity, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={activity.description}
                    secondary={`${activity.user} • ${
                      activity.userRole
                    } • ${new Date(activity.timestamp).toLocaleString()}`}
                  />
                  <Chip
                    label={activity.action}
                    size="small"
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
            <Button variant="outlined" startIcon={<ViewIcon />} sx={{ mt: 2 }}>
              View Full Audit Trail
            </Button>
          </Paper>
        </Grid>

        {/* Report Tools */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generate Reports
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Button variant="outlined" startIcon={<ReportIcon />} fullWidth>
                Financial Audit
              </Button>
              <Button variant="outlined" startIcon={<ReportIcon />} fullWidth>
                Inventory Report
              </Button>
              <Button variant="outlined" startIcon={<ReportIcon />} fullWidth>
                Transaction Log
              </Button>
              <Button variant="outlined" startIcon={<ReportIcon />} fullWidth>
                Compliance Report
              </Button>
            </Box>
          </Paper>

          {/* Quick Stats */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Statistics
            </Typography>
            <Box>
              <Typography variant="body2">
                <strong>Approval Rate:</strong>{" "}
                {Math.round(
                  ((stats?.requisitions?.APPROVED || 0) /
                    (stats?.requisitions?.total || 1)) *
                    100
                )}
                %
              </Typography>
              <Typography variant="body2">
                <strong>Pending Items:</strong>{" "}
                {stats?.requisitions?.PENDING || 0}
              </Typography>
              <Typography variant="body2">
                <strong>Rejection Rate:</strong>{" "}
                {Math.round(
                  ((stats?.requisitions?.REJECTED || 0) /
                    (stats?.requisitions?.total || 1)) *
                    100
                )}
                %
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuditorDashboard;
