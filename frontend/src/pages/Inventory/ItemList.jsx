import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Inventory as InventoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useItems } from "../../services/queries";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import { useAuth } from "../../contexts/AuthContext";

const ItemList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const { user } = useAuth();
  const { openDialog, ConfirmDialogComponent } = useConfirmDialog();

  const {
    data: items,
    isLoading,
    error,
  } = useItems({
    search: searchTerm || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const handleDeleteItem = (item) => {
    openDialog({
      title: "Delete Item",
      message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      severity: "error",
      confirmText: "Delete",
      onConfirm: () => {
        console.log("Deleting item:", item.id);
        // Implement delete functionality
      },
    });
  };

  const columns = [
    {
      field: "name",
      headerName: "Item Name",
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InventoryIcon color="primary" fontSize="small" />
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.description}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: "quantity",
      headerName: "Stock",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {params.value} {params.row.unit}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Min: {params.row.minQuantity}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const status =
          params.row.quantity <= params.row.minQuantity ? "LOW" : "OK";
        return (
          <Chip
            label={status}
            size="small"
            color={status === "LOW" ? "error" : "success"}
            variant={status === "LOW" ? "filled" : "outlined"}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => console.log("View item:", params.row.id)}
          >
            <ViewIcon />
          </IconButton>
          {(user?.role === "ADMIN" || user?.role === "STOREKEEPER") && (
            <>
              <IconButton
                size="small"
                color="secondary"
                onClick={() => console.log("Edit item:", params.row.id)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteItem(params.row)}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner message="Loading inventory..." />;
  if (error) return <div>Error loading inventory: {error.message}</div>;

  return (
    <Box>
      <ConfirmDialogComponent />

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Inventory Management
        </Typography>
        {(user?.role === "ADMIN" || user?.role === "STOREKEEPER") && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => console.log("Add new item")}
          >
            Add New Item
          </Button>
        )}
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          >
            Filters
          </Button>

          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={() => setFilterAnchorEl(null)}
          >
            <MenuItem>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="1">Office Supplies</MenuItem>
                  <MenuItem value="2">IT Equipment</MenuItem>
                  <MenuItem value="3">Cleaning Supplies</MenuItem>
                  <MenuItem value="4">Maintenance Tools</MenuItem>
                  <MenuItem value="5">Medical Supplies</MenuItem>
                </Select>
              </FormControl>
            </MenuItem>
            <MenuItem>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="low">Low Stock</MenuItem>
                  <MenuItem value="ok">In Stock</MenuItem>
                </Select>
              </FormControl>
            </MenuItem>
          </Menu>

          {(categoryFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="text"
              onClick={() => {
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      </Paper>

      {/* Statistics Summary */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Paper sx={{ p: 2, minWidth: 200, textAlign: "center" }}>
          <Typography variant="h4" color="primary">
            {items?.length || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Items
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 200, textAlign: "center" }}>
          <Typography variant="h4" color="error">
            {items?.filter((item) => item.quantity <= item.minQuantity)
              .length || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Low Stock
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 200, textAlign: "center" }}>
          <Typography variant="h4" color="success.main">
            {items?.filter((item) => item.quantity > item.minQuantity).length ||
              0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            In Stock
          </Typography>
        </Paper>
      </Box>

      {/* Data Grid */}
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={items || []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection={false}
          disableSelectionOnClick
          loading={isLoading}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "background.default",
            },
          }}
        />
      </Paper>

      {/* Low Stock Warning */}
      {items?.filter((item) => item.quantity <= item.minQuantity).length >
        0 && (
        <Paper
          sx={{
            p: 2,
            mt: 2,
            backgroundColor: "error.light",
            color: "error.contrastText",
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            ⚠️ Warning:{" "}
            {items.filter((item) => item.quantity <= item.minQuantity).length}
            item(s) are low on stock and need restocking.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ItemList;
