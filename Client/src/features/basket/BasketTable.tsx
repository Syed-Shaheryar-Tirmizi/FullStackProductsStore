import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography, Box } from "@mui/material";
import { removeBasketItemAsync, addBasketItemAsync } from "./basketSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { BasketItem } from "../../app/models/Basket";

interface Props {
    basketItems: BasketItem[],
    isBasket?: boolean
}
export default function BasketTable({ basketItems, isBasket = true }: Props) {
    const { status } = useAppSelector(state => state.basket)
    const dispatch = useAppDispatch();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        {isBasket &&
                            <TableCell align="right"></TableCell>
                        }
                    </TableRow>
                    {basketItems.map((item) => (
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
                            <TableCell align="center" style={{width:"20%"}}>
                                {isBasket && <LoadingButton onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId, quantity: 1, name: 'rem' }))}
                                    loading={status === 'pendingRemoveItem' + item.productId + 'rem'}
                                    color="error">
                                    <Remove />
                                </LoadingButton>
                                }
                                {item.quantity}

                                {isBasket && <LoadingButton onClick={() => dispatch(addBasketItemAsync({ productId: item.productId, quantity: 1 }))}
                                    loading={status === 'pendingAddItem' + item.productId}
                                    color="secondary">
                                    <Add />
                                </LoadingButton>
                                }
                            </TableCell>
                            <TableCell align="right">${((item.price / 100) * item.quantity).toFixed(2)}</TableCell>
                            {isBasket && <TableCell align="right">
                                <LoadingButton onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId, quantity: item.quantity, name: 'del' }))}
                                    loading={status === 'pendingRemoveItem' + item.productId + 'del'}
                                    color="error">
                                    <Delete />
                                </LoadingButton>

                            </TableCell>
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}