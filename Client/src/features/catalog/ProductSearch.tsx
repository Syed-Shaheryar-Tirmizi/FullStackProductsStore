import { debounce, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setParams } from "./catalogSlice";
import { useState } from "react";

export default function ProductSearch() {
    const {productsParams} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState(productsParams.searchTerm);
    const debounceSearch = debounce((event: any) => {
        dispatch(setParams({searchTerm: event.target.value}))
    }, 1000)

    return (
        <TextField
            label="Search products..."
            variant="outlined"
            fullWidth
            value={searchTerm || ''}
            onChange={(event) => {
                setSearchTerm(event.target.value)
                debounceSearch(event)
            }}
        />
    )
}