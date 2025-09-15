import { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRequisitions, useFulfillRequisition } from "../../services/queries";
import { Search as SearchIcon, CheckCircle as FulfillIcon } from "@mui/icons-material";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const FulfillRequisitions = () => {
  const [search, setSearch] = useState("");

  const { data: requisitions, isLoading, error, refetch } = useRequisitions({
    status: "APPROVED",
    search: search || undefined,
  });
  const fulfill = useFulfillRequisition();

  const rows = useMemo(() => requisitions || [], [requisitions]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "title",
      headerName: "Title",
      flex: 2,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.description}
          </Typography>
        </Box>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      renderCell: (params) => <Chip label={params.value?.name || "-"} size="small" variant="outlined" />,
    },
    {
      field: "createdBy",
      headerName: "Requested By",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value?.firstName} {params.value?.lastName}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 130,
      valueGetter: (p) => (p.value ? new Date(p.value).toLocaleDateString() : ""),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<FulfillIcon />}
          onClick={async () => {
            try {
              await fulfill.mutateAsync(params.row.id);
              refetch();
            } catch (e) {
              // Let the error bubble to UI; can add Snackbar if needed
              console.error(e);
            }
          }}
        >
          Fulfill
        </Button>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner message="Loading approved requisitions..." />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">Fulfill Requisitions</Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          placeholder="Search requisitions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: (
            <InputAdornment position="start"><SearchIcon /></InputAdornment>
          )}}
          size="small"
          sx={{ width: 360 }}
        />
      </Paper>

      <Paper sx={{ height: 600 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id || row._id}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          loading={fulfill.isLoading}
        />
      </Paper>
    </Box>
  );
};

export default FulfillRequisitions;
