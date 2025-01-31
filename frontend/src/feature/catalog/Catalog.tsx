import ProductList from "./ProductList.tsx";
import {useEffect} from "react";
import LoadingComponent from "../../app/layout/LoadingComponent.tsx";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore.ts";
import {fetchProductsAsync, productSelectors} from "./catalogSlice.ts";

export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll)
    const {productLoaded, status} = useAppSelector(state => state.catalog)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!productLoaded) {
            dispatch(fetchProductsAsync())
        }
    }, [productLoaded, dispatch])

    if (status.includes("pending")) {
        return <LoadingComponent message="Loading Products..."/>
    }

    return (
        <>
            <ProductList products={products}/>
        </>
    )
}