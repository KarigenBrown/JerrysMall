import {Paper, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import {currencyFormat} from "../../app/util/util.ts";
import {useAppSelector} from "../../app/store/configureStore.ts";

interface Props {
    subtotal?: number
}

export function BasketSummary({subtotal}: Props) {
    const {basket} = useAppSelector(state => state.basket)
    if (subtotal === undefined) {
        subtotal = basket?.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) ?? 0
    }
    const deliveryFee = subtotal > 10000 ? 0 : 500

    return (
        <>
            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery Fee</TableCell>
                            <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{currencyFormat(subtotal + deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{fontStyle: "italic"}}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}