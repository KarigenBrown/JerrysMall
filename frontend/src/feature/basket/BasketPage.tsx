import {
    Button,
    Grid2,
    Typography
} from "@mui/material";
import {BasketSummary} from "./BasketSummary.tsx";
import {Link} from "react-router-dom";
import {useAppSelector} from "../../app/store/configureStore.ts";
import {BasketTable} from "./BasketTable.tsx";

export default function BasketPage() {
    const {basket} = useAppSelector(state => state.basket)

    if (!basket) {
        return <Typography variant="h3">Your basket is empty</Typography>
    }

    return (
        <>
            <BasketTable items={basket.items}/>
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