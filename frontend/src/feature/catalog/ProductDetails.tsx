import {
    Button,
    Divider,
    Grid2,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {useParams} from "react-router-dom";
import {ChangeEvent, useEffect, useState} from "react";
import NotFound from "../../app/error/NotFound.tsx";
import LoadingComponent from "../../app/layout/LoadingComponent.tsx";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore.ts";
import {addBasketItemAsync, removeBasketItemAsync} from "../basket/basketSlice.ts";
import {currencyFormat} from "../../app/util/util.ts";
import {fetchProductByIdAsync, productSelectors} from "./catalogSlice.ts";

export function ProductDetails() {
    const {basket, status} = useAppSelector(state => state.basket)
    const dispatch = useAppDispatch()
    const {id} = useParams<{ id: string }>()
    const product = useAppSelector(state => productSelectors.selectById(state, parseInt(id!)))
    const {status: productStatus} = useAppSelector(state => state.catalog)
    const [quantity, setQuantity] = useState(0)
    const item = basket?.items.find(i => i.productId === product?.id)

    useEffect(() => {
        if (item) {
            setQuantity(item.quantity)
        }
        if (!product) {
            dispatch(fetchProductByIdAsync(parseInt(id!)))
        }
    }, [id, item, dispatch, product])

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        if (parseInt(event.currentTarget.value) >= 0) {
            setQuantity(parseInt(event.currentTarget.value))
        }
    }

    function handleUpdateCart() {
        if (!product) {
            return
        }

        if (!item || quantity > item.quantity) {
            const updatedQuantity = item ? quantity - item.quantity : quantity
            dispatch(addBasketItemAsync({productId: product.id, quantity: updatedQuantity}))
        } else {
            const updatedQuantity = item.quantity - quantity
            dispatch(removeBasketItemAsync({productId: product.id, quantity: updatedQuantity}))
        }
    }

    if (productStatus.includes("pending")) {
        return <LoadingComponent message="Loading product..."/>
    }

    if (!product) {
        return <NotFound/>
    }

    return (
        <Grid2 container spacing={6}>
            <Grid2 size={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: "100%"}}/>
            </Grid2>
            <Grid2 size={6}>
                <Typography variant="h3">{product.name}</Typography>
                <Divider sx={{mb: 2}}/>
                <Typography variant="h4" color="secondary">{currencyFormat(product.price)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid2 container spacing={2}>
                    <Grid2 size={6}>
                        <TextField
                            onChange={handleInputChange}
                            variant="outlined"
                            type="number"
                            label="Quantity in cart"
                            fullWidth
                            value={quantity}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <Button
                            disabled={(item?.quantity === quantity) || (!item && quantity === 0)}
                            loading={status.includes("pending")}
                            onClick={handleUpdateCart}
                            sx={{height: "55px"}}
                            color="primary"
                            size="large"
                            variant="contained"
                            fullWidth
                        >
                            {item ? "Update Quantity" : "Add to Cart"}
                        </Button>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Grid2>
    )
}