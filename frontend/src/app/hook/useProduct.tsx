import {useAppDispatch, useAppSelector} from "../store/configureStore.ts";
import {fetchFilters, fetchProductsAsync, productSelectors} from "../../feature/catalog/catalogSlice.ts";
import {useEffect} from "react";

export default function useProduct() {
    const products = useAppSelector(productSelectors.selectAll)
    const {
        productsLoaded,
        filtersLoaded,
        types,
        brands,
        metaData
    } = useAppSelector(state => state.catalog)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!productsLoaded) {
            dispatch(fetchProductsAsync())
        }
    }, [dispatch, productsLoaded])

    useEffect(() => {
        if (!filtersLoaded) {
            dispatch(fetchFilters())
        }
    }, [dispatch, filtersLoaded]);

    return {
        products,
        productsLoaded,
        filtersLoaded,
        brands,
        types,
        metaData
    }
}