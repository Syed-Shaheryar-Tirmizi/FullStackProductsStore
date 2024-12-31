import { Button, Grid2, Typography } from "@mui/material";
import BasketSummary from "./BasketSummary";
import { Link } from 'react-router-dom';
import { useAppSelector } from "../../app/store/configureStore";
import BasketTable from "./BasketTable";

export default function BasketPage() {
    const { basket } = useAppSelector(state => state.basket)

    if (!basket) return <Typography variant="h3">Your basket is empty</Typography>

    return (
        <>
            <BasketTable basketItems={basket.items} />
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