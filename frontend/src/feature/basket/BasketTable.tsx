import {Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {currencyFormat} from "../../app/util/util.ts";
import {addBasketItemAsync, removeBasketItemAsync} from "./basketSlice.ts";
import {Add, Delete, Remove} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore.ts";
import {BasketItem} from "../../app/model/basket.ts";

interface Props {
    items: BasketItem[],
    isBasket?: boolean
}

export function BasketTable({items, isBasket = true}: Props) {
    const {status} = useAppSelector(state => state.basket)
    const dispatch = useAppDispatch()

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}}>
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        {isBasket &&
                            <TableCell align="right"></TableCell>
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(item => (
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
                                {isBasket &&
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
                                }
                                {item.quantity}
                                {isBasket &&
                                    <Button
                                        loading={status === "pendingRemoveItem" + item.productId}
                                        onClick={() => dispatch(addBasketItemAsync({productId: item.productId}))}
                                        color="secondary"
                                    >
                                        <Add/>
                                    </Button>
                                }
                            </TableCell>
                            <TableCell align="right">${((item.price / 100) * item.quantity).toFixed(2)}</TableCell>
                            {isBasket &&
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
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}