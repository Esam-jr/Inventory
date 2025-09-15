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
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useRequisitionDetail } from "../../services/queries";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useState } from "react";

const RequisitionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: requisition, isLoading, error } = useRequisitionDetail(id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "warning" });
  const handleDelete = () => setConfirmOpen(true);
  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    setSnack({ open: true, message: "Deletion is not supported by the backend.", severity: "warning" });
  };
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "warning",
      APPROVED: "success",
      REJECTED: "error",
      FULFILLED: "info",
    };
    return colors[status] || "default";
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <Typography variant="body1">Loading requisition...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <Typography variant="body1" color="error">
          Error loading requisition: {error.message}
        </Typography>
      </Box>
    );
  }
  if (!requisition) {
    return null;
  }

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
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          sx={{ ml: 2 }}
        >
          Delete
        </Button>
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
              {requisition.items?.map((ri, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={ri.item?.name}
                    secondary={`Quantity: ${ri.quantity} ${ri.item?.unit || ""}`}
                  />
                </ListItem>
              ))}
              {(!requisition.items || requisition.items.length === 0) && (
                <ListItem>
                  <ListItemText primary="No items" />
                </ListItem>
              )}
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
                {requisition.department?.name}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Requested By
              </Typography>
              <Typography variant="body1">
                {requisition.createdBy?.firstName} {requisition.createdBy?.lastName}
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
    {/* Delete confirm and snackbar */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Requisition"
        message="Deletion is not supported by the backend at the moment."
        confirmText="OK"
        cancelText="Close"
        severity="warning"
      />
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnack} severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequisitionDetail;
