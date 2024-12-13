import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ContactPage from "../../features/contact/ContactPage";
import AboutPage from "../../features/about/AboutPage";
import ProductDetailsPage from "../../features/catalog/ProductDetailsPage";
import Catalog from "../../features/catalog/Catalog";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {path: '', element: <HomePage/>},
            {path: 'contact', element: <ContactPage/>},
            {path: 'about', element: <AboutPage/>},
            {path: 'catalog/:id', element: <ProductDetailsPage/>},
            {path: 'Catalog', element: <Catalog/>}
        ]
    }
])