import ProductList from "./ProductList.tsx";
import {useEffect} from "react";
import LoadingComponent from "../../app/layout/LoadingComponent.tsx";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore.ts";
import {fetchFilters, fetchProductsAsync, productSelectors, setPageNumber, setProductParams} from "./catalogSlice.ts";
import {
    Grid2,
    Paper
} from "@mui/material";
import ProductSearch from "./ProductSearch.tsx";
import RadioButtonGroup from "../../app/component/RadioButtonGroup.tsx";
import CheckboxButtons from "../../app/component/CheckboxButtons.tsx";
import AppPagination from "../../app/component/AppPagination.tsx";

interface SortOption {
    value: string,
    label: string
}

const sortOptions: SortOption[] = [
    {value: "name", label: "Alphabetical"},
    {value: "priceDesc", label: "Price - High to Low"},
    {value: "price", label: "Price - Low to High"}
]

export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll)
    const {
        productsLoaded,
        filtersLoaded,
        types,
        brands,
        productParams,
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

    if (!filtersLoaded) {
        return <LoadingComponent message="Loading Products..."/>
    }

    return (
        <Grid2 container columnSpacing={4}>
            <Grid2 size={3}>
                <Paper sx={{mb: 2}}>
                    <ProductSearch/>
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <RadioButtonGroup
                        selectedValue={productParams.orderBy}
                        options={sortOptions}
                        onChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))}
                    />
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <CheckboxButtons
                        items={types}
                        checked={productParams.types ?? []}
                        onChange={(items: string[]) => dispatch(setProductParams({types: items}))}
                    />
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <CheckboxButtons
                        items={brands}
                        checked={productParams.brands ?? []}
                        onChange={(items: string[]) => dispatch(setProductParams({brands: items}))}
                    />
                </Paper>
            </Grid2>
            <Grid2 size={9} sx={{mb: 2}}>
                <ProductList products={products}/>
            </Grid2>
            <Grid2 size={3}/>
            <Grid2 size={9} sx={{mb: 2}}>
                {metaData &&
                    <AppPagination
                        metaData={metaData}
                        onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))}
                    />}
            </Grid2>
        </Grid2>
    )
}