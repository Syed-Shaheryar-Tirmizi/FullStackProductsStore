import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ContactPage from "../../features/contact/ContactPage";
import AboutPage from "../../features/about/AboutPage";
import ProductDetailsPage from "../../features/catalog/ProductDetailsPage";
import Catalog from "../../features/catalog/Catalog";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import LoginPage from "../../features/Account/LoginPage";
import RegisterPage from "../../features/Account/RegisterPage";
import RequireAuth from "./RequireAuth";
import Orders from "../../features/Orders/Orders";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <RequireAuth />, children: [
                    { path: 'checkout', element: <CheckoutPage /> },
                    { path: 'orders', element: <Orders /> }
                ]
            },
            { path: '', element: <HomePage /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'about', element: <AboutPage /> },
            { path: 'catalog/:id', element: <ProductDetailsPage /> },
            { path: 'Catalog', element: <Catalog /> },
            { path: 'Basket', element: <BasketPage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> }
        ]
    }
])