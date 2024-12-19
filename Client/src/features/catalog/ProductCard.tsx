import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/Product";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useStoreContext } from "../../app/context/StoreContext";

interface props {
    product: Product
}

export default function ProdcutCard({ product }: props) {
    const [loading, setLoading] = useState(false);
    const { setBasket } = useStoreContext()

    function handleAddItem() {
        setLoading(true);
        agent.basket.addItem(product.id)
            .then(basket => setBasket(basket))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }

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
                    <LoadingButton loading={loading} onClick={handleAddItem} size="small">Add to cart</LoadingButton>
                    <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
                </CardActions>
            </Card>
        </>
    )
}