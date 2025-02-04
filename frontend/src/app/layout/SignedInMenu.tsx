import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import {useAppDispatch, useAppSelector} from "../store/configureStore.ts";
import {signOut} from "../../feature/account/accountSlice.ts";
import React from "react";
import {clearBasket} from "../../feature/basket/basketSlice.ts";

export default function SignedInMenu() {
    const dispatch = useAppDispatch()
    const {user} = useAppSelector(state => state.account)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    function handleClick(event: any) {
        setAnchorEl(event.currentTarget);
    };

    function handleClose() {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                color="inherit"
                onClick={handleClick}
                sx={{typography: "h6"}}
            >
                {user?.email}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My orders</MenuItem>
                <MenuItem onClick={() => {
                    dispatch(signOut())
                    dispatch(clearBasket())
                }}>Logout</MenuItem>
            </Menu>
        </>
    );
}
