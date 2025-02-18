import {Box, Pagination, Typography} from "@mui/material";
import {MetaData} from "../model/pagination.ts";
import {useState} from "react";

interface Props {
    metaData: MetaData,
    onPageChange: (page: number) => void
}

export default function AppPagination({metaData, onPageChange}: Props) {
    const {currentPage, totalCount, totalPages, pageSize} = metaData
    const [pageNumber, setPageNumber] = useState(currentPage)
    
    function handlePageChange(page: number) {
        setPageNumber(page)
        onPageChange(page)
    }

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
            <Typography>Displaying {(currentPage - 1) * pageSize + 1} - {currentPage * pageSize > totalCount
                ? totalCount
                : currentPage * pageSize} of {totalCount} items </Typography>
            <Pagination
                color="secondary"
                size="large"
                count={totalPages}
                page={pageNumber}
                onChange={(_, page) => handlePageChange(page)}
            />
        </Box>
    )
}