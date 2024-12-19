import { Box, Button, Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useStoreContext } from "../../app/context/StoreContext";
import agent from "../../app/api/agent";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { Link } from 'react-router-dom';

export default function BasketPage() {
    const { basket, setBasket, removeItem } = useStoreContext()
    const [status, setStatus] = useState({
        loading: false,
        name: ''
    })

    function handleRemoveItem(productId: number, quantity = 1, name: string) {
        setStatus({ loading: true, name});
        agent.basket.removeItem(productId, quantity)
            .then(() => removeItem(productId, quantity))
            .catch(error => console.log(error))
            .finally(() => setStatus({ loading: false, name: '' }));
    }

    function handleAddItem(productId: number, name: string) {
        setStatus({ loading: true, name });
        agent.basket.addItem(productId)
            .then(basket => setBasket(basket))
            .catch(error => console.log(error))
            .finally(() => setStatus({loading: false, name: ''}));
    }

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
                                <LoadingButton onClick={() => handleRemoveItem(item.productId, 1, 'rem'+item.productId)} 
                                loading={status.loading && status.name === 'rem'+item.productId} 
                                color="error">
                                    <Remove />
                                </LoadingButton>
                                {item.quantity}
                                <LoadingButton onClick={() => handleAddItem(item.productId, 'add'+item.productId)} 
                                loading={status.loading && status.name === 'add'+item.productId} 
                                color="secondary">
                                    <Add />
                                </LoadingButton>
                            </TableCell>
                            <TableCell>${((item.price / 100) * item.quantity).toFixed(2)}</TableCell>
                            <TableCell align="right">
                                <LoadingButton onClick={() => handleRemoveItem(item.productId, item.quantity, 'del'+item.productId)} 
                                loading={status.loading && status.name === 'del'+item.productId} 
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