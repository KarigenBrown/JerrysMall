import {Typography, Grid2} from '@mui/material';
import {BasketTable} from "../basket/BasketTable.tsx";
import {BasketSummary} from "../basket/BasketSummary.tsx";
import {useAppSelector} from "../../app/store/configureStore.ts";

export default function Review() {
    const {basket} = useAppSelector(state => state.basket)

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Order summary
            </Typography>
            {basket &&
                <BasketTable items={basket.items} isBasket={false}/>
            }
            <Grid2 container>
                <Grid2 size={6}/>
                <Grid2 size={6}>
                    <BasketSummary/>
                </Grid2>
            </Grid2>
        </>
    );
}