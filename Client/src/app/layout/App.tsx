import { useEffect, useState } from "react"
import { Product } from "../models/Product";
import Catalog from "../../features/catalog/Catalog";
import Header from "./Header";
import { Container } from "@mui/material";

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
    <>
      <Header />
      <Container>
        <Catalog products={products} addProduct={addProduct} />
      </Container>
    </>
  )
}

export default App
