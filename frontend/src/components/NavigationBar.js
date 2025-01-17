import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useStyles from "../styles/NavigationAppBarStyles";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CustomAlert from "./CustomAlert";
import LogoutIcon from "@mui/icons-material/Logout";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

export default function NavigationAppBar() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [user, setUser] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("userToken");
      setAuth(!!token);
      if (token) {
        const uniqueId = localStorage.getItem("uniqueId");
        fetchUserData(uniqueId);
      }
    };

    checkAuthStatus();

    // Listen for an 'authChange' event
    window.addEventListener("authChange", checkAuthStatus);

    // Cleanup
    return () => {
      window.removeEventListener("authChange", checkAuthStatus);
    };
  }, [location]); // Added location as a dependency

  const fetchUserData = async () => {
    try {
      const uniqueId = localStorage.getItem("_id");
      if (!uniqueId) {
        console.error("No user ID found in local storage");
        return;
      }
      const response = await fetch(
        `http://localhost:5000/users/profile/${uniqueId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccountPopupOpen = () => {
    setAccountPopupOpen(true);
  };

  const handleAccountPopupClose = () => {
    setAccountPopupOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
    handleClose();
    window.location.reload();
  };

  const handleSignup = () => {
    navigate("/signup");
    handleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    setAuth(false);
    navigate("/login");
    window.dispatchEvent(new Event("authChange"));
  };

  const handleSearch = () => {
    navigate(`/homepage?search=${searchQuery}`);
  };

  const handleAdminDashboard = () => {
    if (user.role !== "administrator") {
      setAlert({ show: true, type: "error", message: "You are not an admin!" });
      return;
    }
    navigate("/admin-dashboard");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {alert.show && (
        <CustomAlert
          showAlert={alert.show}
          alertMessage={alert.message}
          success={alert.type === "success"}
        />
      )}
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Titan Store
            </Link>
          </Typography> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>

              <img
                src="https://img.freepik.com/premium-vector/letter-logo-m-titan-logo_755682-491.jpg"
                alt="Titan Store Logo"
                style={{ height: "50px", borderRadius: "50%", marginTop: "8px" }}
              />
            </Link>
          </Typography>
          {auth ? (
            <>
              <TextField
                label="Search Products"
                variant="outlined"
                size="small"
                sx={{ mr: 2, ml: "auto" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <IconButton
                size="large"
                edge="end"
                aria-label="account"
                color="inherit"
                onClick={handleAccountPopupOpen}
              >
                <AccountCircle />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handleLogout}
                aria-label="logout"
              >
                <LogoutIcon />
              </IconButton>
              {/* <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button> */}
              <IconButton
                color="inherit"
                onClick={handleAdminDashboard}
                aria-label="admin dashboard"
              >
                <SupervisorAccountIcon />
              </IconButton>
            </>
          ) : (
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem key="login" onClick={handleLogin}>
                Login
              </MenuItem>
              <MenuItem key="signup" onClick={handleSignup}>
                Signup
              </MenuItem>
            </Menu>
          )}
        </Toolbar>
      </AppBar>
      {/* Account Popup Dialog */}
      <Dialog open={accountPopupOpen} onClose={handleAccountPopupClose}>
        <DialogTitle>Account Details</DialogTitle>
        <DialogContent>
          {user ? (
            <>
              <Typography variant="body1">
                <b>First Name:</b> {user.firstName}
              </Typography>
              <Typography variant="body1">
                <b>Last Name:</b> {user.lastName}
              </Typography>
              <Typography variant="body1">
                <b>Email:</b> {user.email}
              </Typography>
              <Typography variant="body1">
                <b>Username:</b> {user.username}
              </Typography>
              <Typography variant="body1">
                <b>Account Balance:</b> {user.accountBalance}
              </Typography>
              <Typography variant="body1">
                <b>Role:</b> {user.role}
              </Typography>
              {/* Add more fields as needed */}
            </>
          ) : (
            <Typography>Loading user details...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAccountPopupClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
