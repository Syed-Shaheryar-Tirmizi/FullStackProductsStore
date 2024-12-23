import { Grid2, Paper } from "@mui/material"
import LoadingComponent from "../../app/layout/LoadingComponent"
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore"
import { fetchFiltersAsync, fetchProductsAsync, productSelectors, setPageNumber, setParams } from "./catalogSlice"
import ProductList from "./ProductList"
import { useEffect } from "react"
import ProductSearch from "./ProductSearch"
import RadioButtonGroup from "../../app/components/RadioButtonGroup"
import CheckBoxButtons from "../../app/components/CheckBoxButtons"
import AppPagination from "../../app/components/AppPagination"

export default function Catalog() {

    const sortOptions = [
        { value: 'name', label: 'Alphabetical' },
        { value: 'priceDesc', label: 'Price - High to Low' },
        { value: 'price', label: 'Price - Low to High' }
    ]
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, filtersLoaded, types, brands, productsParams, metaData } = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync())
    }, [dispatch, productsLoaded])

    useEffect(() => {
        if (!filtersLoaded) dispatch(fetchFiltersAsync())
    }, [dispatch, filtersLoaded])

    if (!filtersLoaded) return <LoadingComponent message="Loading products..." />
    return (
        <Grid2 container columnSpacing={4}>
            <Grid2 size={{ xs: 3 }}>
                <Paper sx={{ mb: 2 }}>
                    <ProductSearch />
                </Paper>

                <Paper sx={{ mb: 2, p: 2 }}>
                    <RadioButtonGroup options={sortOptions}
                        selectedValue={productsParams.orderBy}
                        onChange={(event) => { dispatch(setParams({ orderBy: event.target.value })) }} />
                </Paper>

                <Paper sx={{ mb: 2, p: 2 }}>
                    <CheckBoxButtons
                        items={brands}
                        checked={productsParams.brands}
                        onChange={(brands: string[]) => dispatch(setParams({ brands }))}
                    />
                </Paper>

                <Paper sx={{ mb: 2, p: 2 }}>
                    <CheckBoxButtons
                        items={types}
                        checked={productsParams.types}
                        onChange={(types: string[]) => dispatch(setParams({ types }))}
                    />
                </Paper>
            </Grid2>
            <Grid2 size={{ xs: 9 }}>
                <ProductList products={products} />
            </Grid2>
            <Grid2 size={{ xs: 3 }} />
            <Grid2 size={{ xs: 9 }} sx={{ mb: 2 }}>
                {
                    metaData &&
                    <AppPagination
                        metaData={metaData}
                        onPageChange={(page: number) => dispatch(setPageNumber({ pageNumber: page }))} />
                }
            </Grid2>
        </Grid2>
    );

}