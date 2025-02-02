import {Grid2} from "@mui/material";
import {Product} from "../../app/model/product.ts";
import ProductCard from "./ProductCard.tsx";
import {useAppSelector} from "../../app/store/configureStore.ts";
import ProductCardSkeleton from "./ProductCardSkeleton.tsx";

interface Props {
    products: Product[]
}

export default function ProductList({products}: Props) {
    const {productsLoaded} = useAppSelector(state => state.catalog)

    return (
        <Grid2 container spacing={4}>
            {products.map(product => (
                <Grid2 size={4} key={product.id}>
                    {!productsLoaded ? (
                        <ProductCardSkeleton/>
                    ) : (
                        <ProductCard product={product}/>
                    )}
                </Grid2>
            ))}
        </Grid2>
    )
}