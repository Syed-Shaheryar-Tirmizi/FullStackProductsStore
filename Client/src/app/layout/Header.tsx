import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useStoreContext } from "../context/StoreContext";

const midLinks = [
    { title: 'catalog', path: '/catalog' },
    { title: 'about', path: '/about' },
    { title: 'contact', path: '/contact' }
]
const rightLinks = [
    { title: 'login', path: '/login' },
    { title: 'register', path: '/register' }
]
const navStyles = {
    color: 'inherit',
    typography: 'h6',
    '&:hover': {
        color: 'secondary.main'
    },
    '&.active': {
        color: 'text.secondary'
    },
    textDecoration: 'none'
}

interface Props {
    darkMode: boolean
    handleThemeChange: () => void
}

export default function Header({ darkMode, handleThemeChange }: Props) {
    const {basket} = useStoreContext()
    const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box display='flex' alignItems='center'>
                    <Typography variant="h6" component={NavLink} to='/' sx={navStyles}>
                        Products Store
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Box>

                <List sx={{ display: 'flex' }}>
                    {midLinks.map((midLink) => (
                        <ListItem
                            component={NavLink}
                            to={midLink.path}
                            key={midLink.path}
                            sx={navStyles}
                        >
                            {midLink.title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>

                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='/Basket' size="large" color="inherit">
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    <List sx={{ display: 'flex' }}>
                        {rightLinks.map((rightLink) => (
                            <ListItem
                                component={NavLink}
                                to={rightLink.path}
                                key={rightLink.path}
                                sx={navStyles}
                            >
                                {rightLink.title.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>

            </Toolbar>
        </AppBar>
    )
}