import {Typography, Grid2, TextField, FormControlLabel, Checkbox} from "@mui/material";

export default function PaymentForm() {
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <TextField
                        required
                        id="cardName"
                        label="Name on card"
                        fullWidth
                        autoComplete="cc-name"
                        variant="standard"
                    />
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <TextField
                        required
                        id="cardNumber"
                        label="Card number"
                        fullWidth
                        autoComplete="cc-number"
                        variant="standard"
                    />
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <TextField
                        required
                        id="expDate"
                        label="Expiry date"
                        fullWidth
                        autoComplete="cc-exp"
                        variant="standard"
                    />
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <TextField
                        required
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