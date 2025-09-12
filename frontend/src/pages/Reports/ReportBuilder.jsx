import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const ReportBuilder = () => {
  const [reportType, setReportType] = useState("inventory");
  const [dateRange, setDateRange] = useState("30days");
  const [format, setFormat] = useState("pdf");

  const reportTypes = [
    { value: "inventory", label: "Inventory Report" },
    { value: "transactions", label: "Transaction Report" },
    { value: "requisitions", label: "Requisition Report" },
    { value: "audit", label: "Audit Trail Report" },
    { value: "financial", label: "Financial Summary" },
  ];

  const handleGenerateReport = () => {
    console.log("Generating report:", { reportType, dateRange, format });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Report Builder
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Report Configuration
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                {reportTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="30days">Last 30 Days</MenuItem>
                <MenuItem value="90days">Last 90 Days</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select
                value={format}
                label="Format"
                onChange={(e) => setFormat(e.target.value)}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {dateRange === "custom" && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Custom Date Range
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="End Date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleGenerateReport}
          >
            Generate Report
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              setReportType("inventory");
              setDateRange("30days");
              setFormat("pdf");
            }}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Reports
        </Typography>
        <Typography color="text.secondary">
          Your generated reports will appear here...
        </Typography>
      </Paper>
    </Box>
  );
};

export default ReportBuilder;
