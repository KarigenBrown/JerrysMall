import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../layout/App.tsx";
import Catalog from "../../feature/catalog/Catalog.tsx";
import {ProductDetails} from "../../feature/catalog/ProductDetails.tsx";
import {AboutPage} from "../../feature/about/AboutPage.tsx";
import {ContactPage} from "../../feature/contact/ContactPage.tsx";
import ServerError from "../error/ServerError.tsx";
import NotFound from "../error/NotFound.tsx";
import BasketPage from "../../feature/basket/BasketPage.tsx";
import CheckoutPage from "../../feature/checkout/CheckoutPage.tsx";
import Login from "../../feature/account/Login.tsx";
import Register from "../../feature/account/Register.tsx";
import RequiredAuth from "./RequiredAuth.tsx";
import OrderPage from "../../feature/order/OrderPage.tsx";
import CheckoutWrapper from "../../feature/checkout/CheckoutWrapper.tsx";
import Inventory from "../../feature/admin/Inventory.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                element: <RequiredAuth/>, children: [
                    {path: "checkout", element: <CheckoutWrapper/>},
                    {path: "order", element: <OrderPage/>},
                    {path: "inventory", element: <Inventory/>},
                ]
            },
            {path: "catalog", element: <Catalog/>},
            {path: "catalog/:id", element: <ProductDetails/>},
            {path: "about", element: <AboutPage/>},
            {path: "contact", element: <ContactPage/>},
            {path: "server-error", element: <ServerError/>},
            {path: "not-found", element: <NotFound/>},
            {path: "basket", element: <BasketPage/>},
            {path: "login", element: <Login/>},
            {path: "register", element: <Register/>},
            {path: "checkout", element: <CheckoutPage/>},
            {path: "*", element: <Navigate replace to="/not-found"/>},
        ]
    }
])