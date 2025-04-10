import { useState, useEffect } from "react";
import { Box, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Home, Person, Category, LiveTv, Movie, Logout, Menu } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const [showIcon, setShowIcon] = useState(true);
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userToken"));
    const navigate = useNavigate();

    // Show icon only when scrolled to top
    useEffect(() => {
        const handleScroll = () => {
            setShowIcon(window.scrollY === 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("userToken"));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    
    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo"); // Remove user info from local storage
        setIsLoggedIn(false); // Immediately update state
        navigate("/");
    };


    // Toggle sidebar visibility
    const toggleDrawer = () => {
        setOpen(!open);
    };

    // Handle navigation on clicking menu items
    const handleNavigation = (path) => {
        navigate(path);
        setOpen(false);
    };

    // Sidebar Menu Items
    const menuItems = [
        { text: "Home", icon: <Home />, path: "/home" },
        { text: "Profile", icon: <Person />, path: "/profile" },
        { text: "Categories", icon: <Category />, path: "/categories" },
        { text: "TV Shows", icon: <LiveTv />, path: "/tvshows" },
        { text: "Movies", icon: <Movie />, path: "/movies" },
    ];

    return (
        <>
            {/* Hamburger Menu Icon */}
            {showIcon && (
                <IconButton
                    onClick={toggleDrawer}
                    sx={{
                        position: "fixed",
                        top: 14,
                        left: 14,
                        zIndex: 1200,
                        color: "white",
                        padding: "8px",
                        borderRadius: "8px",
                    }}
                >
                    <Menu fontSize="large" />
                </IconButton>
            )}

            {/* Sidebar Drawer */}
            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer}
                PaperProps={{
                    sx: {
                        backgroundColor: "#141414",
                        color: "white",
                        width: { xs: "70vw", sm: "250px" }, // Responsive width
                        paddingTop: 2,
                        borderRadius: "0 12px 12px 0",
                    },
                }}
                transitionDuration={300} // Smooth transition
            >
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        paddingX: 1,
                    }}
                >
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    paddingY: 1.5,
                                    marginY: 0.5,
                                    borderRadius: 2,
                                    "&:hover": { backgroundColor: "#1e1e1e" },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#df0707", minWidth: "35px" }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: "1rem",
                                        fontWeight: 500,
                                    }}
                                />
                            </ListItem>
                        ))}

                        {/* Show Logout only if logged in */}
                        {isLoggedIn && (
                            <ListItem
                                button
                                key={"Logout"}
                                onClick={handleLogout}
                                sx={{
                                    paddingY: 1.5,
                                    height: "50px",
                                    borderRadius: '10px',
                                    color: "white",
                                    backgroundColor: "#c91c1c",
                                    // border: "2px solid #a51a1a", // Slight border
                                    marginTop: 5,
                                    "&:hover": { backgroundColor: "#a51a1a" },
                                }}
                            >
                                <ListItemIcon sx={{ color: "white", minWidth: "35px" }}>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Sidebar;
