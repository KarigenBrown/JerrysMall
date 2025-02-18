import ProductList from "./ProductList.tsx";
import LoadingComponent from "../../app/layout/LoadingComponent.tsx";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore.ts";
import {setPageNumber, setProductParams} from "./catalogSlice.ts";
import {
    Grid2,
    Paper
} from "@mui/material";
import ProductSearch from "./ProductSearch.tsx";
import RadioButtonGroup from "../../app/component/RadioButtonGroup.tsx";
import CheckboxButtons from "../../app/component/CheckboxButtons.tsx";
import AppPagination from "../../app/component/AppPagination.tsx";
import useProduct from "../../app/hook/useProduct.tsx";

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
    const {products, brands, types, filtersLoaded, metaData} = useProduct()
    const {productParams} = useAppSelector(state => state.catalog)
    const dispatch = useAppDispatch()

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
            <Grid2 size={9}>
                {metaData &&
                    <AppPagination
                        metaData={metaData}
                        onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))}
                    />}
            </Grid2>
        </Grid2>
    )
}