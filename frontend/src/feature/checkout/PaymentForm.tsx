import {Typography, Grid2, TextField} from "@mui/material";
import {useFormContext} from "react-hook-form";
import AppTextInput from "../../app/component/AppTextInput.tsx";
import {StripeInput} from "./StripeInput.tsx";
import {CardCvcElement, CardExpiryElement, CardNumberElement} from "@stripe/react-stripe-js";
import {StripeElementType} from "@stripe/stripe-js";

interface Props {
    cardState: { elementError: { [key in StripeElementType]?: string } },
    onCardInputChange: (event: any) => void
}

export default function PaymentForm({cardState, onCardInputChange}: Props) {
    const {control} = useFormContext()

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <AppTextInput control={control} name="nameOnCard" label="Name on card"/>
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <TextField
                        onChange={onCardInputChange}
                        error={!!cardState.elementError.cardNumber}
                        helperText={cardState.elementError.cardNumber}
                        id="cardNumber"
                        label="Card number"
                        fullWidth
                        autoComplete="cc-number"
                        variant="outlined"
                        slotProps={{
                            inputLabel: {shrink: true},
                            input: {
                                inputComponent: StripeInput,
                                inputProps: {
                                    component: CardNumberElement
                                }
                            }
                        }}
                    />
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <TextField
                        onChange={onCardInputChange}
                        error={!!cardState.elementError.cardExpiry}
                        helperText={cardState.elementError.cardExpiry}
                        id="expDate"
                        label="Expiry date"
                        fullWidth
                        autoComplete="cc-exp"
                        variant="outlined"
                        slotProps={{
                            inputLabel: {shrink: true},
                            input: {
                                inputComponent: StripeInput,
                                inputProps: {
                                    component: CardExpiryElement
                                }
                            }
                        }}
                    />
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <TextField
                        onChange={onCardInputChange}
                        error={!!cardState.elementError.cardCvc}
                        helperText={cardState.elementError.cardCvc}
                        id="cvv"
                        label="CVV"
                        fullWidth
                        autoComplete="cc-csc"
                        variant="outlined"
                        slotProps={{
                            inputLabel: {shrink: true},
                            input: {
                                inputComponent: StripeInput,
                                inputProps: {
                                    component: CardCvcElement
                                }
                            }
                        }}
                    />
                </Grid2>
            </Grid2>
        </>
    );
}