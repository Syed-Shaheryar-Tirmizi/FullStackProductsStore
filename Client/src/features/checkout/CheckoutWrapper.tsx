import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";
import { useAppDispatch } from "../../app/store/configureStore";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function CheckoutWrapper() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.payment.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [dispatch]);

    if (loading) return <LoadingComponent message="Loading checkout..." />

    const stripePromise = loadStripe("pk_test_51Qc5LsDwr8Eojf0IxDLJMTeMIXtHJ4WJH5H0IyKP83DMByLntjrMVZKReyzTgJjoEg6Z7xQW3neazZgv9kWQ5hQV00X5HjXsLB");
    return (
        <>
            <Elements stripe={stripePromise}>
                <CheckoutPage />
            </Elements>
        </>
    )
}