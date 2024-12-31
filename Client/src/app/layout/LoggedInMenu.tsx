import { Button, Fade, Menu, MenuItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { useState } from "react";
import { logOut } from "../../features/Account/AccountSlice";
import { clearBasket } from "../../features/basket/basketSlice";
import { Link } from "react-router-dom";

export default function LoggedInMenu() {
    const { user } = useAppSelector(state => state.account)
    const dispatch = useAppDispatch()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                color="inherit"
                onClick={handleClick}
                sx={{ typography: 'h6' }}>
                {user?.email}
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} TransitionComponent={Fade}>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem component={Link} to='/orders'>My Orders</MenuItem>
                <MenuItem onClick={() => {
                    dispatch(logOut())
                    dispatch(clearBasket())
                    }}>Logout</MenuItem>
            </Menu>
        </>
    )
}