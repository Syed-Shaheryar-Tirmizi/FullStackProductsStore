import { Grid2 } from "@mui/material"
import { Product } from "../../app/models/Product"
import ProdcutCard from "./ProductCard"
import { useAppSelector } from "../../app/store/configureStore";
import ProductCardSkeleton from "./ProductCardSelection";

interface props {
    products: Product[]
}

export default function ProductList({ products }: props) {
    const { productsLoaded } = useAppSelector(state => state.catalog);
    return (
        <>
            <Grid2 container spacing={4}>
                {products.map((product) => (
                    <Grid2 size={4} key={product.id} >
                        {!productsLoaded ? (
                            <ProductCardSkeleton />
                        ) : (<ProdcutCard product={product}></ProdcutCard>)}
                    </Grid2>
                )
                )}
            </Grid2>
        </>
    )
}