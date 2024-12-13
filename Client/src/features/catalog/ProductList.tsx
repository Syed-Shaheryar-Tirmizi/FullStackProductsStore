import { Grid2 } from "@mui/material"
import { Product } from "../../app/models/Product"
import ProdcutCard from "./ProductCard"

interface props {
    products: Product[]
}

export default function ProductList({ products }: props) {
    return (
        <>
            <Grid2 container spacing={4}>
                {products.map((product) => (
                    <Grid2 size={3} key={product.id} >
                    <ProdcutCard product={product}></ProdcutCard>
                    </Grid2>
                )
                )}
            </Grid2>
        </>
    )
}