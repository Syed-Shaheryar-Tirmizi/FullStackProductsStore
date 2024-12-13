import { Divider, Grid2, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/Product";

export default function ProductDetailsPage() {
    const { id } = useParams<string>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/Products/${id}`)
            .then((response) => setProduct(response.data))
            .catch((error) => console.log(error))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <h3>Loading...</h3>;
    if (!product) return <h3>Product not found</h3>;

    return (
        <Grid2 container spacing={6}>
            <Grid2 size={{xs:12, md:6}}>
                <img
                    src={product.pictureUrl}
                    alt={product.name}
                    style={{
                        width: "100%",
                        maxHeight: "400px",
                        objectFit: "cover",
                        borderRadius: "8px",
                    }}
                />
            </Grid2>

            <Grid2 size={{xs:12, md:6}}>
                <Typography variant="h3">{product.name}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h4" color="secondary">
                    ${product.price.toFixed(2)}
                </Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid2>
        </Grid2>
    );
}
