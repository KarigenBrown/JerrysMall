import {Button, Card, CardActions, CardContent, CardMedia, Typography} from "@mui/material";
import {Product} from "../../app/model/product.ts";
import {Link} from "react-router-dom";
import {useState} from "react";
import agent from "../../app/api/agent.ts";
import {useStoreContext} from "../../app/context/StoreContext.tsx";
import {currencyFormat} from "../../app/util/util.ts";

interface Props {
    product: Product
}

export default function ProductCard({product}: Props) {
    const [loading, setLoading] = useState(false)
    const {setBasket} = useStoreContext()

    function handleAddItem(productId: number) {
        setLoading(true)
        agent.Basket.addItem(productId)
            .then(basket => setBasket(basket))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }

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
                    loading={loading}
                    onClick={() => handleAddItem(product.id)}
                    size="small"
                >
                    Add to Cart
                </Button>
                <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
            </CardActions>
        </Card>
    )
}