import {Elements} from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage.tsx";
import {loadStripe} from "@stripe/stripe-js";
import {useAppDispatch} from "../../app/store/configureStore.ts";
import {useEffect, useState} from "react";
import agent from "../../app/api/agent.ts";
import {setBasket} from "../basket/basketSlice.ts";
import LoadingComponent from "../../app/layout/LoadingComponent.tsx";

const stripePromise = loadStripe("pk_test_51Qs4DJGHdOKPixfCKYDqZVvhNoi7v3ZErqAwlTJHAyVWsZrjBvG9pnhkG2WQYMaq3nPDUDlKNNPm7kVaJeEfepPD00hrf9q3Za")

export default function CheckoutWrapper() {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 付款第一步,创建payment intent
        agent.Payment.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }, [dispatch]);

    if (loading) {
        return <LoadingComponent message="Loading checkout..."/>
    }

    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage/>
        </Elements>
    )
}