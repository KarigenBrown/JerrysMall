import {Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography} from "@mui/material";
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
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{bgcolor: 'secondary.main'}}>
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.name}
                slotProps={{
                    sx: {fontWeight: 'bold', color: 'primary.main'}
                }}
            />
            <CardMedia
                sx={{height: 140, backgroundSize: 'contain', bgcolor: 'primary.light'}}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5" component="div">
                    {currencyFormat(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} / {product.type}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    loading={status === 'pendingAddItem' + product.id}
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