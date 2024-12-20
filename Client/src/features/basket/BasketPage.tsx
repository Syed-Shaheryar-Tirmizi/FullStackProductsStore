import { Box, Button, Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "./basketSlice";

export default function BasketPage() {
    const { basket, status } = useAppSelector(state => state.basket)
    const dispatch = useAppDispatch();

    if (!basket) return <Typography variant="h3">Your basket is empty</Typography>

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell>Subtotal</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                        {basket.items.map((item) => (
                            <TableRow key={item.productId}>
                                <TableCell>
                                    <Typography component='th' scope="row">
                                        <Box display='flex' alignItems='center'>
                                            <img src={item.pictureUrl} alt={item.productName} style={{ height: 50, marginRight: 20 }} />
                                            <span>{item.productName}</span>
                                        </Box>
                                    </Typography>
                                </TableCell>
                                <TableCell>${(item.price / 100).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <LoadingButton onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId, quantity: 1, name: 'rem' }))}
                                        loading={status === 'pendingRemoveItem' + item.productId + 'rem'}
                                        color="error">
                                        <Remove />
                                    </LoadingButton>
                                    {item.quantity}
                                    <LoadingButton onClick={() => dispatch(addBasketItemAsync({ productId: item.productId, quantity: 1 }))}
                                        loading={status === 'pendingAddItem' + item.productId}
                                        color="secondary">
                                        <Add />
                                    </LoadingButton>
                                </TableCell>
                                <TableCell>${((item.price / 100) * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <LoadingButton onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId, quantity: item.quantity, name: 'del' }))}
                                        loading={status === 'pendingRemoveItem' + item.productId+'del'}
                                        color="error">
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Grid2 container sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                <Grid2>
                    <BasketSummary />
                    <Button
                        component={Link}
                        to='/checkout'
                        fullWidth
                        variant="contained">
                        Checkout
                    </Button>
                </Grid2>
            </Grid2>
        </>
    )
}