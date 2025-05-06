import { useState, useEffect, Fragment } from "react";
import { Box, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { Home, Person, Category, Logout, Menu, ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const [showIcon, setShowIcon] = useState(true);
    const [open, setOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userToken"));
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setShowIcon(window.scrollY === 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        setIsLoggedIn(false);
        navigate("/");
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const toggleCategories = () => {
        setCategoriesOpen((prev) => !prev);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setOpen(false);
    };

    const scrollHomePage = (length) => {
        window.scrollBy({
            top: length, 
            behavior: "smooth"
        });
        setOpen(false);
    };
    
    const menuItems = [
        { text: "Home", icon: <Home />, path: "/home" },
        { text: "Profile", icon: <Person />, path: "/profile" },
        {
            text: "Categories",
            icon: <Category />,
            subcategories: [
                { text: "Horror", scrollLength: 950 },
                { text: "Comedy", scrollLength: 1800 },
                { text: "Action", scrollLength: 2630 },
                { text: "Bollywood", scrollLength: 3450 },
                { text: "Hollywood", scrollLength: 4230 },
            ],
        },
    ];

    return (
        <>
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

            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer}
                PaperProps={{
                    sx: {
                        backgroundColor: "#141414",
                        color: "white",
                        width: { xs: "70vw", sm: "250px" },
                        paddingTop: 2,
                        borderRadius: "0 12px 12px 0",
                    },
                }}
                transitionDuration={300}
            >
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column", paddingX: 1 }}>
                    <List>
                        {menuItems.map((item) => (
                            <Fragment key={item.text}>
                                <ListItem
                                    button
                                    onClick={item.subcategories ? toggleCategories : () => handleNavigation(item.path)}
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
                                    <ListItemText primary={item.text} />
                                    {item.subcategories && (categoriesOpen ? <ExpandLess /> : <ExpandMore />)}
                                </ListItem>

                                {/* Submenu for Categories */}
                                {item.subcategories && (
                                    <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.subcategories.map((sub) => (
                                                <ListItem
                                                    button
                                                    key={sub.text}
                                                    onClick={() => scrollHomePage(sub.scrollLength)}
                                                    sx={{ pl: 4 ,
                                                        cursor:"pointer"}}
                                                >
                                                    <ListItemText primary={sub.text} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                )}
                            </Fragment>
                        ))}

                        {isLoggedIn && (
                            <ListItem
                                button
                                onClick={handleLogout}
                                sx={{
                                    paddingY: 1.5,
                                    height: "50px",
                                    borderRadius: "10px",
                                    color: "white",
                                    backgroundColor: "#c91c1c",
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
