import { List } from "@mui/material"
import { Product } from "../../app/models/Product"
import ProdcutCard from "./ProductCard"

interface props {
    products: Product[]
}

export default function ProductList({ products }: props) {
    return (
        <>
            <List>
                {products.map((item) => (
                    <ProdcutCard key={item.id} item={item}></ProdcutCard>
                )
                )}
            </List>
        </>
    )
}