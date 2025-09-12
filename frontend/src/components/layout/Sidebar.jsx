import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  RequestQuote as RequisitionIcon,
  Assignment as ServiceRequestIcon,
  Assessment as ReportIcon,
  People as UserIcon,
  Settings as SettingsIcon,
  History as TransactionIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: [
      "ADMIN",
      "STOREKEEPER",
      "PROCUREMENT_OFFICER",
      "DEPARTMENT_HEAD",
      "AUDITOR",
    ],
  },
  {
    text: "Inventory",
    icon: <InventoryIcon />,
    path: "/inventory",
    roles: [
      "ADMIN",
      "STOREKEEPER",
      "PROCUREMENT_OFFICER",
      "DEPARTMENT_HEAD",
      "AUDITOR",
    ],
  },
  {
    text: "Requisitions",
    icon: <RequisitionIcon />,
    path: "/requisitions",
    roles: ["ADMIN", "PROCUREMENT_OFFICER", "DEPARTMENT_HEAD", "AUDITOR"],
  },
  {
    text: "Service Requests",
    icon: <ServiceRequestIcon />,
    path: "/service-requests",
    roles: ["ADMIN", "PROCUREMENT_OFFICER", "DEPARTMENT_HEAD", "AUDITOR"],
  },
  {
    text: "Transactions",
    icon: <TransactionIcon />,
    path: "/transactions",
    roles: ["ADMIN", "STOREKEEPER", "AUDITOR"],
  },
  {
    text: "Reports",
    icon: <ReportIcon />,
    path: "/reports",
    roles: ["ADMIN", "PROCUREMENT_OFFICER", "AUDITOR"],
  },
  {
    text: "User Management",
    icon: <UserIcon />,
    path: "/users",
    roles: ["ADMIN"],
  },
];

const Sidebar = ({ open, onClose, isMobile, userRole }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const drawerWidth = 280;

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const drawerContent = (
    <Box sx={{ width: drawerWidth }}>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          City Inventory
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Management System
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1 }}>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "white" : theme.palette.text.secondary,
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      <List sx={{ px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation("/settings")}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ p: 2, mt: "auto" }}>
        <Typography variant="caption" color="textSecondary" display="block">
          v{import.meta.env.VITE_APP_VERSION}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
