import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { Product } from "../../app/models/Product";

interface props{
    item: Product
}

export default function ProdcutCard({item}: props) {
    return (
        <>
            <ListItem key={item.id}>
                <ListItemAvatar>
                    <Avatar src={item.pictureUrl} />
                </ListItemAvatar>
                <ListItemText>
                    {item.name} - {item.price}
                </ListItemText>
            </ListItem>
        </>
    )
}