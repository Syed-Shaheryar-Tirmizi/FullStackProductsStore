import { Divider, Grid2, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

export default function ProductDetailsPage() {
    const { basket, status } = useAppSelector(state => state.basket)
    const dispatch = useAppDispatch()
    const { id } = useParams<string>();
    const product = useAppSelector(state => productSelectors.selectById(state, parseInt(id!)));
    const [quantity, setQuantity] = useState(0);
    const {status: productStatus} = useAppSelector(state => state.catalog);

    const item = basket?.items.find(i => i.productId === product?.id);

    useEffect(() => {
        if (item) setQuantity(item.quantity); 
        if(!product) dispatch(fetchProductAsync(parseInt(id!)));
    }, [id, item, dispatch, product]);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        if (parseInt(event.target.value) >= 0) setQuantity(parseInt(event.target.value));
    }

    function updateQuantity() {
        if (!product) return;
        if (!item || quantity > item.quantity) {
            const updatedQuantity = item ? quantity - item.quantity : quantity;
            dispatch(addBasketItemAsync({ productId: product.id, quantity: updatedQuantity }))
        }
        else {
            const updatedQuantity = item.quantity - quantity;
            dispatch(removeBasketItemAsync({ productId: product.id, quantity: updatedQuantity }))
        }
    }

    if (productStatus.includes('pending')) return <LoadingComponent message="Loading a product" />
    if (!product) return <h3>Product not found</h3>;

    return (
        <Grid2 container spacing={6}>
            <Grid2 size={{ xs: 12, md: 6 }}>
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

            <Grid2 size={{ xs: 12, md: 6 }}>
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
                <Grid2 container spacing={2} alignItems="center">
                    <Grid2 spacing={{ xs: 6 }}>
                        <TextField
                            variant="outlined"
                            type="number"
                            label="Quantity in cart"
                            fullWidth
                            value={quantity}
                            onChange={handleInputChange}
                        />
                    </Grid2>
                    <Grid2 spacing={{ xs: 6 }}>
                        <LoadingButton
                            disabled={item?.quantity == quantity || quantity === 0}
                            onClick={updateQuantity}
                            loading={status.includes('pending')}
                            color="primary"
                            size="large"
                            variant="contained"
                            fullWidth>
                            {item ? "Update quantity" : "Add to cart"}
                        </LoadingButton>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Grid2>
    );
}
