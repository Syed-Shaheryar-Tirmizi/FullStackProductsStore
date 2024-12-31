import { Grid2, Typography } from '@mui/material';
import BasketTable from '../basket/BasketTable';
import BasketSummary from '../basket/BasketSummary';
import { useAppSelector } from '../../app/store/configureStore';

export default function Review() {
    const { basket } = useAppSelector(state => state.basket)
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Order summary
            </Typography>
            {basket &&
            <BasketTable basketItems={basket.items} isBasket={false} />}
            <Grid2 container sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                <Grid2>
                    <BasketSummary />
                </Grid2>
            </Grid2>
            
        </>
    );
}
