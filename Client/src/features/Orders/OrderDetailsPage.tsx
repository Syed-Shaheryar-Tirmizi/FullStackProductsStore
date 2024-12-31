import { Box, Button, Grid, Typography } from "@mui/material";
import { Orders } from "../../app/models/Orders";
import { BasketItem } from "../../app/models/Basket";
import BasketTable from "../basket/BasketTable";
import BasketSummary from "../basket/BasketSummary";

interface Props {
    order: Orders
    setSelectedOrder: (id: number) => void
}
export default function OrderDetailsPage({ order, setSelectedOrder }: Props) {
    const subTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return (
        <>
            <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} gutterBottom variant="h4">Order# {order.id} - {order.status}</Typography>
                <Button onClick={() => setSelectedOrder(0)} sx={{ m: 2 }} variant="contained" size="large"></Button>
            </Box>
            <BasketTable basketItems={order.items as BasketItem[]} isBasket={false} />

            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <BasketSummary subtotal={subTotal} />
                </Grid>
            </Grid>
        </>
    )
}