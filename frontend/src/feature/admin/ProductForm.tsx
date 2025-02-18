import {Typography, Paper, Box, Button, Grid2} from "@mui/material";
import {FieldValues, useForm} from "react-hook-form";
import AppTextInput from "../../app/component/AppTextInput";
import {Product} from "../../app/model/product.ts";
import {useEffect} from "react";
import useProduct from "../../app/hook/useProduct.tsx";
import AppSelectList from "../../app/component/AppSelectList.tsx";
import AppDropzone from "../../app/component/AppDropzone.tsx";
import {yupResolver} from "@hookform/resolvers/yup";
import {validationSchema} from "./productValidation.ts";
import agent from "../../app/api/agent.ts";
import {useAppDispatch} from "../../app/store/configureStore.ts";
import {setProduct} from "../catalog/catalogSlice.ts";

interface Props {
    product?: Product,
    cancelEdit: () => void
}

export default function ProductForm({product, cancelEdit}: Props) {
    const {control, reset, handleSubmit, watch, formState: {isDirty, isSubmitting}} = useForm({
        resolver: yupResolver<any>(validationSchema)
    });
    const {brands, types} = useProduct()
    const watchFile = watch("file", null)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (product && !watchFile && !isDirty) {
            reset(product)
        }
        return () => {
            if (watchFile) {
                URL.revokeObjectURL(watchFile.preview)
            }
        }
    }, [product, reset, watchFile, isDirty]);

    async function handleSubmitData(data: FieldValues) {
        try {
            let response: Product
            if (product) {
                response = await agent.Admin.updateProduct(data)
            } else {
                response = await agent.Admin.createProduct(data)
            }
            dispatch(setProduct(response))
            cancelEdit()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box component={Paper} sx={{p: 4}}>
            <Typography variant="h4" gutterBottom sx={{mb: 4}}>
                Product Details
            </Typography>
            <form onSubmit={handleSubmit(handleSubmitData)}>
                <Grid2 container spacing={3}>
                    <Grid2 size={{xs: 12, sm: 12}}>
                        <AppTextInput control={control} name='name' label='Product name'/>
                    </Grid2>
                    <Grid2 size={{xs: 12, sm: 6}}>
                        <AppSelectList control={control} items={types} name='type' label='Type'/>
                    </Grid2>
                    <Grid2 size={{xs: 12, sm: 6}}>
                        <AppSelectList control={control} items={brands} name='brand' label='Brand'/>
                    </Grid2>
                    <Grid2 size={{xs: 12, sm: 6}}>
                        <AppTextInput control={control} type="number" name='price' label='Price'/>
                    </Grid2>
                    <Grid2 size={{xs: 12, sm: 6}}>
                        <AppTextInput control={control} type="number" name='quantityInStock' label='Quantity in Stock'/>
                    </Grid2>
                    <Grid2 size={12}>
                        <AppTextInput control={control} multiline rows={4} name='description' label='Description'/>
                    </Grid2>
                    <Grid2 size={12}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <AppDropzone control={control} name='file'/>
                            {watchFile ? (
                                <img src={watchFile.preview} alt="preview" style={{maxHeight: 200}}/>
                            ) : (
                                <img src={product?.pictureUrl} alt={product?.name} style={{maxHeight: 200}}/>
                            )}
                        </Box>
                    </Grid2>
                </Grid2>
                <Box display='flex' justifyContent='space-between' sx={{mt: 3}}>
                    <Button onClick={cancelEdit} variant='contained' color='inherit'>Cancel</Button>
                    <Button loading={isSubmitting} type="submit" variant='contained' color='success'>Submit</Button>
                </Box>
            </form>
        </Box>
    )
}