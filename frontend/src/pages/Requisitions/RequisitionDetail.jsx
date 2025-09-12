import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const RequisitionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const requisition = {
    id: 1,
    title: "Office Supplies Request",
    description: "Monthly office supplies for administration department",
    status: "APPROVED",
    department: { name: "Administration" },
    createdBy: { firstName: "John", lastName: "Doe" },
    createdAt: "2024-01-15T10:30:00.000Z",
    items: [
      { item: { name: "A4 Paper", unit: "ream" }, quantity: 5 },
      { item: { name: "Ballpoint Pens", unit: "box" }, quantity: 2 },
    ],
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "warning",
      APPROVED: "success",
      REJECTED: "error",
      FULFILLED: "info",
    };
    return colors[status] || "default";
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate("/requisitions")}
          variant="outlined"
        >
          Back to List
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Requisition Details
        </Typography>
        <Chip
          label={requisition.status}
          color={getStatusColor(requisition.status)}
          sx={{ ml: "auto" }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {requisition.title}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {requisition.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Items Requested
            </Typography>
            <List>
              {requisition.items.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={item.item.name}
                    secondary={`Quantity: ${item.quantity} ${item.item.unit}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Requisition Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Department
              </Typography>
              <Typography variant="body1">
                {requisition.department.name}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Requested By
              </Typography>
              <Typography variant="body1">
                {requisition.createdBy.firstName}{" "}
                {requisition.createdBy.lastName}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Date Created
              </Typography>
              <Typography variant="body1">
                {new Date(requisition.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Requisition ID
              </Typography>
              <Typography variant="body1">#{requisition.id}</Typography>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<PrintIcon />}
              sx={{ mt: 2 }}
            >
              Print Requisition
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RequisitionDetail;
