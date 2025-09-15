import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Chip, Button, Divider, List, ListItem, ListItemText, Grid, Menu, MenuItem, Snackbar, Alert } from "@mui/material";
import { ArrowBack as BackIcon, Print as PrintIcon, MoreVert as MoreIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useServiceRequestDetail, useUpdateServiceRequestStatus } from "../../services/queries";
import { useState } from "react";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const statusColor = (status) => {
  const map = { PENDING: "warning", APPROVED: "success", REJECTED: "error", IN_PROGRESS: "info", COMPLETED: "success" };
  return map[status] || "default";
};

const ServiceRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: request, isLoading, error } = useServiceRequestDetail(id);
  const updateStatus = useUpdateServiceRequestStatus();
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "warning" });
  const handleDelete = () => setConfirmOpen(true);
  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    setSnack({ open: true, message: "Deletion is not supported by the backend.", severity: "warning" });
  };
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  if (isLoading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><Typography>Loading...</Typography></Box>;
  if (error) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><Typography color="error">Error: {error.message}</Typography></Box>;
  if (!request) return null;

  const handleChangeStatus = async (status) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      setAnchorEl(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate("/service-requests")} variant="outlined">Back to List</Button>
        <Typography variant="h4" component="h1" fontWeight="bold">Service Request Details</Typography>
        <Chip label={request.status} color={statusColor(request.status)} sx={{ ml: "auto" }} />
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete} sx={{ ml: 1, mr: 1 }}>Delete</Button>
        <Button variant="text" onClick={(e) => setAnchorEl(e.currentTarget)} startIcon={<MoreIcon />}>Actions</Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => handleChangeStatus("APPROVED")}>Approve</MenuItem>
          <MenuItem onClick={() => handleChangeStatus("REJECTED")}>Reject</MenuItem>
          <MenuItem onClick={() => handleChangeStatus("IN_PROGRESS")}>Mark In Progress</MenuItem>
          <MenuItem onClick={() => handleChangeStatus("COMPLETED")}>Mark Completed</MenuItem>
        </Menu>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>{request.title}</Typography>
            <Typography color="text.secondary" paragraph>{request.description}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>Items Requested</Typography>
            <List>
              {request.items?.map((ri, index) => (
                <ListItem key={index} divider>
                  <ListItemText primary={ri.item?.name} secondary={`Quantity: ${ri.quantity} ${ri.item?.unit || ""}`} />
                </ListItem>
              ))}
              {(!request.items || request.items.length === 0) && (
                <ListItem>
                  <ListItemText primary="No items" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Request Information</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Requested By</Typography>
              <Typography variant="body1">{request.createdBy?.firstName} {request.createdBy?.lastName}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Date Created</Typography>
              <Typography variant="body1">{new Date(request.createdAt).toLocaleDateString()}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Request ID</Typography>
              <Typography variant="body1">#{request.id}</Typography>
            </Box>

            <Button fullWidth variant="outlined" startIcon={<PrintIcon />} sx={{ mt: 2 }}>Print Request</Button>
          </Paper>
        </Grid>
      </Grid>
    {/* Delete confirm and snackbar */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Service Request"
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

export default ServiceRequestDetail;
