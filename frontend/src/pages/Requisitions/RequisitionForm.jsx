import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useItems } from "../../services/queries";

const RequisitionForm = ({ editMode = false, requisition = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: requisition?.title || "",
    description: requisition?.description || "",
    items: requisition?.items || [],
  });
  const [selectedItems, setSelectedItems] = useState([]);

  const { data: items, isLoading } = useItems();

  const handleAddItem = (item, quantity) => {
    if (quantity > 0) {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, { itemId: item.id, quantity, item }],
      }));
    }
  };

  const handleRemoveItem = (itemId) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.itemId !== itemId),
    }));
  };

  const handleSubmit = () => {
    console.log("Submitting requisition:", formData);
    navigate("/requisitions");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate("/requisitions")}
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {editMode ? "Edit Requisition" : "Create Requisition"}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Requisition Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Selected Items ({formData.items.length})
            </Typography>
            {formData.items.map((item) => (
              <Card key={item.itemId} variant="outlined" sx={{ mb: 1 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {item.item?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Quantity: {item.quantity} {item.item?.unit}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveItem(item.itemId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
            {formData.items.length === 0 && (
              <Typography color="text.secondary" textAlign="center" py={3}>
                No items selected
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Items
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: "auto" }}>
              {items?.map((item) => (
                <Card key={item.id} variant="outlined" sx={{ mb: 1 }}>
                  <CardContent>
                    <Typography variant="body2" fontWeight="medium">
                      {item.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      Stock: {item.quantity} {item.unit}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <TextField
                        size="small"
                        type="number"
                        placeholder="Qty"
                        inputProps={{ min: 1, max: item.quantity }}
                        sx={{ width: 80 }}
                        onChange={(e) => {
                          const quantity = parseInt(e.target.value);
                          if (quantity > 0) {
                            setSelectedItems((prev) => ({
                              ...prev,
                              [item.id]: quantity,
                            }));
                          }
                        }}
                      />
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() =>
                          handleAddItem(item, selectedItems[item.id] || 1)
                        }
                      >
                        Add
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            {editMode ? "Update Requisition" : "Create Requisition"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RequisitionForm;
