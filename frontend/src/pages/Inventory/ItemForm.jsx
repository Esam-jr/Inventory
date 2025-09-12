import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  Inventory as ItemIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCreateItem, useUpdateItem } from "../../services/queries";

const steps = ["Basic Information", "Stock Details", "Review"];

const ItemForm = ({ editMode = false, item = null }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    categoryId: item?.categoryId || "",
    quantity: item?.quantity || 0,
    minQuantity: item?.minQuantity || 0,
    unit: item?.unit || "",
  });
  const [errors, setErrors] = useState({});

  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.name) newErrors.name = "Item name is required";
      if (!formData.categoryId) newErrors.categoryId = "Category is required";
    }

    if (step === 1) {
      if (formData.quantity < 0)
        newErrors.quantity = "Quantity cannot be negative";
      if (formData.minQuantity < 0)
        newErrors.minQuantity = "Minimum quantity cannot be negative";
      if (!formData.unit) newErrors.unit = "Unit is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateItemMutation.mutateAsync({
          id: item.id,
          ...formData,
        });
      } else {
        await createItemMutation.mutateAsync(formData);
      }
      navigate("/inventory");
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Item Name"
                value={formData.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleChange("description")}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel>Category *</InputLabel>
                <Select
                  value={formData.categoryId}
                  label="Category *"
                  onChange={handleChange("categoryId")}
                >
                  <MenuItem value={1}>Office Supplies</MenuItem>
                  <MenuItem value={2}>IT Equipment</MenuItem>
                  <MenuItem value={3}>Cleaning Supplies</MenuItem>
                  <MenuItem value={4}>Maintenance Tools</MenuItem>
                  <MenuItem value={5}>Medical Supplies</MenuItem>
                </Select>
                {errors.categoryId && (
                  <Typography variant="caption" color="error">
                    {errors.categoryId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange("quantity")}
                error={!!errors.quantity}
                helperText={errors.quantity}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Quantity"
                type="number"
                value={formData.minQuantity}
                onChange={handleChange("minQuantity")}
                error={!!errors.minQuantity}
                helperText={errors.minQuantity}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.unit}>
                <InputLabel>Unit of Measurement *</InputLabel>
                <Select
                  value={formData.unit}
                  label="Unit of Measurement *"
                  onChange={handleChange("unit")}
                >
                  <MenuItem value="piece">Piece</MenuItem>
                  <MenuItem value="box">Box</MenuItem>
                  <MenuItem value="pack">Pack</MenuItem>
                  <MenuItem value="ream">Ream</MenuItem>
                  <MenuItem value="bottle">Bottle</MenuItem>
                  <MenuItem value="kit">Kit</MenuItem>
                  <MenuItem value="unit">Unit</MenuItem>
                  <MenuItem value="meter">Meter</MenuItem>
                  <MenuItem value="liter">Liter</MenuItem>
                </Select>
                {errors.unit && (
                  <Typography variant="caption" color="error">
                    {errors.unit}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Item Details
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Name:
                  </Typography>
                  <Typography variant="body1">{formData.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Category:
                  </Typography>
                  <Typography variant="body1">
                    {formData.categoryId === 1 && "Office Supplies"}
                    {formData.categoryId === 2 && "IT Equipment"}
                    {formData.categoryId === 3 && "Cleaning Supplies"}
                    {formData.categoryId === 4 && "Maintenance Tools"}
                    {formData.categoryId === 5 && "Medical Supplies"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Description:
                  </Typography>
                  <Typography variant="body1">
                    {formData.description || "No description"}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Quantity:
                  </Typography>
                  <Typography variant="body1">
                    {formData.quantity} {formData.unit}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Minimum:
                  </Typography>
                  <Typography variant="body1">
                    {formData.minQuantity} {formData.unit}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Typography
                    variant="body1"
                    color={
                      formData.quantity <= formData.minQuantity
                        ? "error"
                        : "success.main"
                    }
                  >
                    {formData.quantity <= formData.minQuantity
                      ? "LOW STOCK"
                      : "OK"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate("/inventory")}
          variant="outlined"
        >
          Back to Inventory
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          <ItemIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          {editMode ? "Edit Item" : "Add New Item"}
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3 }}>
        {renderStepContent(activeStep)}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={
                createItemMutation.isLoading || updateItemMutation.isLoading
              }
            >
              {createItemMutation.isLoading || updateItemMutation.isLoading
                ? "Saving..."
                : editMode
                ? "Update Item"
                : "Create Item"}
            </Button>
          ) : (
            <Button onClick={handleNext} variant="contained">
              Next
            </Button>
          )}
        </Box>
      </Paper>

      {(createItemMutation.error || updateItemMutation.error) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error:{" "}
          {createItemMutation.error?.message ||
            updateItemMutation.error?.message}
        </Alert>
      )}
    </Box>
  );
};

export default ItemForm;
