import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse"; 
import CrudServices from "../Services/CrudServices";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const drawerWidth = 240;
const service = new CrudServices();

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Layout() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false); // Added state for User submenu
  const [openItems, setOpenItems] = React.useState(false); // Added state for Items submenu
  const [menuData, setMenuData] = useState([]);
  const [subMenuData, setSubMenuData] = useState({}); // State for storing submenu data
  const [openSubMenus, setOpenSubMenus] = useState({}); // State to control which submenus are open


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dept");
    window.location.href = "/";
  };

  const handleUserClick = () => {
    setOpenUser(!openUser);
  };

  const handleItemsClick = () => {
    setOpenItems(!openItems);
  };

  const handleMenuClick = async (menuId) => {
    try {
      // Fetch submenus for the clicked menu
      const response = await service.SubMenuRecord(menuId);
      
      // Get the department from localStorage
      const userDept = localStorage.getItem('user_id');
  
      // Filter submenus based on the department (role) match
      const filteredSubMenus = response.data.filter(subMenu => subMenu.user_id === userDept);
  
      // Store the filtered submenu data for this menuId
      setSubMenuData(prevData => ({ ...prevData, [menuId]: filteredSubMenus }));
  
      // Toggle the submenu's open state
      setOpenSubMenus(prevState => ({ ...prevState, [menuId]: !prevState[menuId] }));
    } catch (error) {
      console.error("Error fetching submenus:", error);
    }
  };
  

  // Fetch menu data on component mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await service.MenuRecord();
        setMenuData(response.data); // Store fetched menu data
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenu();
  }, []);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <Link to="/dashboard" style={{ textDecoration: "none", color: "white" }}>
            Home
            </Link>
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            style={{ marginLeft: "auto" }}
          >
            <IconButton
              aria-label="logout"
              style={{ color: "white", cursor: "pointer" }}
              onClick={handleLogout}
            >
              <LogoutIcon />
            </IconButton>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List> 
          {menuData.map((menu) => ( 
            <React.Fragment key={menu.id}> 
              <ListItem disablePadding> 
                <ListItemButton onClick={() => handleMenuClick(menu.id)}> 
                  <ListItemIcon> 
                    {menu.icon === "inbox" ? <InboxIcon /> : <MailIcon />} 
                  </ListItemIcon> 
                  <ListItemText primary={menu.menu} /> 
                  {openSubMenus[menu.id] ? <ExpandLess /> : <ExpandMore />} 
                </ListItemButton> 
              </ListItem> 
              <Collapse in={openSubMenus[menu.id]} timeout="auto" unmountOnExit> 
                <List component="div" disablePadding> 
                  {subMenuData[menu.id] && subMenuData[menu.id].map((subMenu) => ( 
                    <ListItem key={subMenu.id} disablePadding> 
                      <ListItemButton href={subMenu.url}> 
                      
                        <ListItemText primary={subMenu.submenu} /> 
                      </ListItemButton> 
                    </ListItem> 
                  ))} 
                </List> 
              </Collapse> 
            </React.Fragment> 
          ))} 
        </List> 
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {/* This is where the routed components will render */}
        <Outlet />
      </Main>
    </Box>
  );
}
