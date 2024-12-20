import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/Product";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";

interface props {
    product: Product
}

export default function ProdcutCard({ product }: props) {
    const { status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    return (
        <>
            <Card sx={{ display: "flex", flexDirection: 'column', height: '100%' }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: "secondary.main" }}>
                            {product.name.charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    title={
                        product.name
                    }
                    titleTypographyProps={{
                        sx: { fontWeight: "bold", color: "primary.main" }
                    }}
                />
                <CardMedia
                    sx={{ height: 140, backgroundSize: "contain", bgcolor: "primary.light" }}
                    image={product.pictureUrl}
                    title={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" color="secondary">
                        ${(product.price / 100).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {product.brand} / {product.name}
                    </Typography>
                </CardContent>
                <CardActions>
                    <LoadingButton
                        loading={status === 'pendingAddItem' + product.id}
                        onClick={() => dispatch(addBasketItemAsync({ productId: product.id }))}
                        size="small">
                        Add to cart
                    </LoadingButton>
                    <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
                </CardActions>
            </Card>
        </>
    )
}