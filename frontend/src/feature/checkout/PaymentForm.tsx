import {Typography, Grid2, TextField, FormControlLabel, Checkbox} from "@mui/material";
import {useForm} from "react-hook-form";
import AppTextInput from "../../app/component/AppTextInput.tsx";

export default function PaymentForm() {
    const {control} = useForm()

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <AppTextInput label="nameOnCard" name="Name on card" control={control}/>
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <TextField
                        // required
                        id="cardNumber"
                        label="Card number"
                        fullWidth
                        autoComplete="cc-number"
                        variant="standard"
                    />
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <TextField
                        // required
                        id="expDate"
                        label="Expiry date"
                        fullWidth
                        autoComplete="cc-exp"
                        variant="standard"
                    />
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <TextField
                        // required
                        id="cvv"
                        label="CVV"
                        helperText="Last three digits on signature strip"
                        fullWidth
                        autoComplete="cc-csc"
                        variant="standard"
                    />
                </Grid2>
                <Grid2 size={12}>
                    <FormControlLabel
                        control={<Checkbox color="secondary" name="saveCard" value="yes"/>}
                        label="Remember credit card details for next time"
                    />
                </Grid2>
            </Grid2>
        </>
    );
}