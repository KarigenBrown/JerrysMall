import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../layout/App.tsx";
import {HomePage} from "../../feature/home/HomePage.tsx";
import Catalog from "../../feature/catalog/Catalog.tsx";
import {ProductDetails} from "../../feature/catalog/ProductDetails.tsx";
import {AboutPage} from "../../feature/about/AboutPage.tsx";
import {ContactPage} from "../../feature/contact/ContactPage.tsx";
import ServerError from "../error/ServerError.tsx";
import NotFound from "../error/NotFound.tsx";
import BasketPage from "../../feature/basket/BasketPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <HomePage/>},
            {path: "catalog", element: <Catalog/>},
            {path: "catalog/:id", element: <ProductDetails/>},
            {path: "about", element: <AboutPage/>},
            {path: "contact", element: <ContactPage/>},
            {path: "server-error", element: <ServerError/>},
            {path: "not-found", element: <NotFound/>},
            {path: "basket", element: <BasketPage/>},
            {path: "*", element: <Navigate replace to="/not-found"/>},
        ]
    }
])