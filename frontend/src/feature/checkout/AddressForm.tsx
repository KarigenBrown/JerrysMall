import {Typography, Grid2} from "@mui/material";
import {useFormContext} from "react-hook-form";
import AppTextInput from "../../app/component/AppTextInput.tsx";
import AppCheckbox from "../../app/component/AppCheckbox.tsx";

export default function AddressForm() {
    const {control} = useFormContext()

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Shipping address
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 size={{xs: 12, sm: 12}}>
                    <AppTextInput control={control} name="fullName" label="Full name"/>
                </Grid2>
                <Grid2 size={12}>
                    <AppTextInput control={control} name="address1" label="Address 1"/>
                </Grid2>
                <Grid2 size={12}>
                    <AppTextInput control={control} name="address2" label="Address 2"/>
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <AppTextInput control={control} name="city" label="City"/>
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <AppTextInput control={control} name="state" label="State"/>
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <AppTextInput control={control} name="zip" label="Zipcode"/>
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <AppTextInput control={control} name="country" label="Country"/>
                </Grid2>
                <Grid2 size={12}>
                    <AppCheckbox name="saveAddress" label="Save this as the default address" control={control}/>
                </Grid2>
            </Grid2>
        </>
    );
}