import { useEffect, useState } from "react"
import { Product } from "../models/Product";
import { Typography } from "@mui/material";
import Catalog from "../../features/catalog/Catalog";

function App() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch("http://localhost:5000/api/Products")
    .then(response => response.json())
    .then(data => setProducts(data))
  }, [])

  function addProduct() {
    setProducts(previousState => [...previousState, 
        { 
          name: "Brand",
          price: 1,
          brand: "Brand",
          description: "Brand",
          pictureUrl: "Brand",
          type: "Brand",
          id: 111,
          quantityInStock: 101
        }])
  }
  

  return (
    <div>
      <Typography variant="h1">Prodcut-Store</Typography>
      <Catalog products={products} addProduct={addProduct}/>
    </div>
  )
}

export default App
