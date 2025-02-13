import {Order} from "../../app/model/order.ts";
import {Box, Button, Grid2, Typography} from "@mui/material";
import {BasketTable} from "../basket/BasketTable.tsx";
import {BasketItem} from "../../app/model/basket.ts";
import {BasketSummary} from "../basket/BasketSummary.tsx";

interface Props {
    order: Order,
    setSelectedOrder: (id: number) => void
}

export default function OrderDetails({order, setSelectedOrder}: Props) {
    const subtotal = order.orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0) ?? 0

    return (
        <>
            <Box display="flex" justifyContent="space-between">
                <Typography sx={{p: 2}} gutterBottom variant="h4">
                    Order# {order.id} - {order.orderStatus}
                </Typography>
                <Button onClick={() => setSelectedOrder(0)} sx={{m: 2}} variant="contained">
                    Back to orders
                </Button>
            </Box>
            <BasketTable items={order.orderItems as BasketItem[]} isBasket={false}/>
            <Grid2 container>
                <Grid2 size={6}/>
                <Grid2 size={6}>
                    <BasketSummary subtotal={subtotal}/>
                </Grid2>
            </Grid2>
        </>
    )
}