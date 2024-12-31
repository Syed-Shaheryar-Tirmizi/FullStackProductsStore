import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchOrdersAsync } from "../checkout/OrdersSlice";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import OrderDetailsPage from "./OrderDetailsPage";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function Orders() {
    const { orders, ordersLoaded } = useAppSelector(state => state.order);
    const dispatch = useAppDispatch();
    const [selectedOrder, setSelectedOrder] = useState(0)

    useEffect(() => {
        dispatch(fetchOrdersAsync());
    })

    if(!ordersLoaded) return <LoadingComponent message="Loading orders..." />
    if(selectedOrder > 0) {
        return (
            <OrderDetailsPage order = {orders.find(x => x.id === selectedOrder)!} setSelectedOrder={setSelectedOrder} />
        )
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Order number</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Order date</TableCell>
                        <TableCell align="right">Order status</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow
                            key={order.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {order.id}
                            </TableCell>
                            <TableCell align="right">{order.total}</TableCell>
                            <TableCell align="right">{order.orderDate}</TableCell>
                            <TableCell align="right">{order.status}</TableCell>
                            <TableCell align="right"><Button onClick={() => setSelectedOrder(order.id)}>View</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
            
    )
}