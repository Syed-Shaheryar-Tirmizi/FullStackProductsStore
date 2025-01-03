import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/Pagination";

interface Props {
    metaData: MetaData,
    onPageChange: (page: number) => void
}

export default function AppPagination({metaData, onPageChange}: Props) {
    const {pageSize, totalCount, currentPage, totalPages} = metaData
    return (
        <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography> 
                Displaying {(currentPage-1)*pageSize+1}-{currentPage*pageSize > totalCount ? totalCount : currentPage*pageSize} of {totalCount} items...</Typography>
            <Pagination
                color="secondary"
                size="large"
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => onPageChange(page)}
            />
        </Box>
    )
}