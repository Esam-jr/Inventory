import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  AccountCircle,
  Lock,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useThemeContext } from "../../contexts/ThemeContext";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { mode } = useThemeContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(credentials);

      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const demoAccounts = [
    { email: "admin@city.gov", password: "admin123", role: "Admin" },
    {
      email: "storekeeper@city.gov",
      password: "store123",
      role: "Storekeeper",
    },
    {
      email: "procurement@city.gov",
      password: "procure123",
      role: "Procurement",
    },
    {
      email: "head.publicworks@city.gov",
      password: "dept123",
      role: "Department Head",
    },
  ];

  const fillDemoAccount = (account) => {
    setCredentials({
      email: account.email,
      password: account.password,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          mode === "dark"
            ? "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "450px",
          borderRadius: 3,
          background:
            mode === "dark"
              ? "rgba(33, 33, 33, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box textAlign="center" mb={3}>
          <AccountCircle sx={{ fontSize: 64, color: "primary.main", mb: 1 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            City Inventory System
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to access your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={loading}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={loading}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={<LoginIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontSize: "1.1rem",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Demo Accounts
          </Typography>
        </Divider>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Try these demo accounts:
          </Typography>

          {demoAccounts.map((account, index) => (
            <Button
              key={index}
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => fillDemoAccount(account)}
              sx={{
                mt: 1,
                justifyContent: "flex-start",
                textTransform: "none",
              }}
            >
              <Box textAlign="left">
                <Typography variant="body2" noWrap>
                  {account.role}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {account.email}
                </Typography>
              </Box>
            </Button>
          ))}
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            v{import.meta.env.VITE_APP_VERSION} •{" "}
            {import.meta.env.VITE_APP_NAME}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;
