import {Button, Card, CardActions, CardContent, CardMedia, Typography} from "@mui/material";
import {Product} from "../../app/model/product.ts";
import {Link} from "react-router-dom";
import {currencyFormat} from "../../app/util/util.ts";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore.ts";
import {addBasketItemAsync} from "../basket/basketSlice.ts";

interface Props {
    product: Product
}

export default function ProductCard({product}: Props) {
    const {status} = useAppSelector(state => state.basket)
    const dispatch = useAppDispatch()

    return (
        <Card
            elevation={3}
            sx={{
                width: 280,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <CardMedia
                sx={{height: 240, backgroundSize: 'cover'}}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography
                    gutterBottom
                    sx={{textTransform: 'uppercase'}}
                    variant="subtitle2">
                    {product.name}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{color: 'secondary.main'}}
                >
                    {currencyFormat(product.price)}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    loading={status === "pendingAddItem" + product.id}
                    onClick={() => dispatch(addBasketItemAsync({productId: product.id}))}
                    size="small"
                >
                    Add to Cart
                </Button>
                <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
            </CardActions>
        </Card>
    )
}