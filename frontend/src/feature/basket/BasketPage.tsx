import {
    Box, Button, Grid2,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Add, Delete, Remove} from "@mui/icons-material";
import {BasketSummary} from "./BasketSummary.tsx";
import {currencyFormat} from "../../app/util/util.ts";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore.ts";
import {addBasketItemAsync, removeBasketItemAsync} from "./basketSlice.ts";

export default function BasketPage() {
    const {basket, status} = useAppSelector(state => state.basket)
    const dispatch = useAppDispatch()

    if (!basket) {
        return <Typography variant="h3">Your basket is empty</Typography>
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket.items.map(item => (
                            <TableRow
                                key={item.productId}
                                sx={{"&:last-child td, &last-child th": {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    <Box display="flex" alignItems="center">
                                        <img src={item.pictureUrl} alt={item.name}
                                             style={{height: 50, marginRight: 20}}/>
                                        <span>{item.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">{currencyFormat(item.price)}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        loading={status === "pendingRemoveItem" + item.productId + "rem"}
                                        onClick={() => dispatch(removeBasketItemAsync({
                                            productId: item.productId,
                                            quantity: 1,
                                            name: "rem"
                                        }))}
                                        color="error"
                                    >
                                        <Remove/>
                                    </Button>
                                    {item.quantity}
                                    <Button
                                        loading={status === "pendingRemoveItem" + item.productId}
                                        onClick={() => dispatch(addBasketItemAsync({productId: item.productId}))}
                                        color="secondary"
                                    >
                                        <Add/>
                                    </Button>
                                </TableCell>
                                <TableCell align="right">${((item.price / 100) * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        loading={status === "pendingRemoveItem" + item.productId + "del"}
                                        onClick={() => dispatch(removeBasketItemAsync({
                                            productId: item.productId,
                                            quantity: item.quantity,
                                            name: "del"
                                        }))}
                                        color="error"
                                    >
                                        <Delete/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid2 container>
                <Grid2 size={6}/>
                <Grid2 size={6}>
                    <BasketSummary/>
                    <Button
                        component={Link}
                        to="/checkout"
                        variant="contained"
                        size="large"
                        fullWidth
                    >
                        Checkout
                    </Button>
                </Grid2>
            </Grid2>
        </>
    )
}