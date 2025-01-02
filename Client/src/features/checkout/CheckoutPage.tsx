import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./checkoutValidations";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { createOrderAsync } from "./OrdersSlice";
import { clearBasket } from "../basket/basketSlice";
import { LoadingButton } from "@mui/lab";
import agent from "../../app/api/agent";
import { StripeElementType } from "@stripe/stripe-js";
import { CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";

const steps = ['Shipping address', 'Review your order', 'Payment details'];

export default function CheckoutPage() {
    const dispatch = useAppDispatch();
    const { orderNo } = useAppSelector(state => state.order);
    const { basket } = useAppSelector(state => state.basket);
    const [activeStep, setActiveStep] = useState(0);
    const [cardComplete, setCardComplete] = useState<any>({ cardNumber: false, cardCvc: false, exp: false });
    const [cardState, setCardState] = useState<{ elementError: { [key in StripeElementType]?: string } }>({ elementError: {} });
    const [paymentMessage, setPaymentMessage] = useState('');
    const [paymentSucceeded, setPaymentSucceeded] = useState(false);

    const stripe = useStripe()
    const element = useElements()

    function onCardInputChange(event: any) {
        setCardState({
            ...cardState,
            elementError: {
                ...cardState.elementError,
                [event.elementType]: event.error?.message
            }
        })
        setCardComplete({ ...cardComplete, [event.elementType]: event.complete })
    }

    const methods = useForm({
        mode: "all",
        resolver: yupResolver(validationSchema[activeStep]),
    });

    useEffect(() => {
        agent.account.getSavedAddress().then(response => {
            if (response) {
                methods.reset({ ...methods.getValues(), ...response, saveAddress: false })
            }
        })
    }, [methods])

    async function submitOrder(data: FieldValues) {
        const { saveAddress, ...shippingAddress } = data

        if (!stripe || !element) return;

        try {
            const cardElements = element.getElement(CardNumberElement);
            const paymentResult = await stripe.confirmCardPayment(basket?.clientSecret!, {
                payment_method: {
                    card: cardElements!,
                    billing_details: {
                        name: shippingAddress.fullName
                    }
                }
            });

            if (paymentResult.paymentIntent?.status === 'succeeded') {
                await dispatch(createOrderAsync({ shippingAddress, saveAddress }));
                dispatch(clearBasket())
                setPaymentSucceeded(true);
                setPaymentMessage('Thank you - we have received your payment');
            }
            else {
                setPaymentMessage(paymentResult.error?.message!);
            }
        }
        catch (error) {
            console.log(error);
        }

    }
    const handleNext = async (data: FieldValues) => {
        if (activeStep === steps.length - 1) {
            await submitOrder(data);
        }
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <AddressForm />;
            case 1:
                return <Review />;
            case 2:
                return <PaymentForm cardState={cardState} onCardInputChange={onCardInputChange} />;
            default:
                throw new Error('Unknown step');
        }
    }


    function submitDisabled(): boolean {
        console.log("Card Complete:", cardComplete);
        if (activeStep === steps.length - 1) {
            return !cardComplete.cardNumber || !cardComplete.cardCvc || !cardComplete.cardExpiry || !methods.formState.isValid
        } else {
            return !methods.formState.isValid
        }
    }

    return (
        <FormProvider {...methods}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center">
                    Checkout
                </Typography>
                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <>
                    {activeStep === steps.length ? (
                        <>
                            <Typography variant="h5" gutterBottom>
                                {paymentMessage}
                            </Typography>
                            {paymentSucceeded ? (
                                <Typography variant="subtitle1">
                                    Your order number is #{orderNo}. We have emailed your order
                                    confirmation, and will send you an update when your order has
                                    shipped.
                                </Typography>
                            ) : (
                                <Button variant="contained" onClick={handleBack}>
                                    Go back and try again
                                </Button>
                            )}

                        </>
                    ) : (
                        <form onSubmit={methods.handleSubmit(handleNext)}>
                            {getStepContent(activeStep)}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                        Back
                                    </Button>
                                )}
                                <LoadingButton
                                    loading={methods.formState.isSubmitting}
                                    disabled={submitDisabled()}
                                    variant="contained"
                                    type="submit"
                                    sx={{ mt: 3, ml: 1 }}
                                >
                                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                                </LoadingButton>
                            </Box>
                        </form>
                    )}
                </>
            </Paper>
        </FormProvider>
    );
}
