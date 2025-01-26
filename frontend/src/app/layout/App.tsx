import Header from "./Header.tsx";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {getCookie} from "../util/util.ts";
import agent from "../api/agent.ts";
import LoadingComponent from "./LoadingComponent.tsx";
import {useDispatch} from "react-redux";
import {setBasket} from "../../feature/basket/basketSlice.ts";

function App() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const buyerId = getCookie("buyerId")
        if (buyerId) {
            agent.Basket.get()
                .then(basket => dispatch(setBasket(basket)))
                    .catch(error => console.log(error))
                    .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [dispatch]);

    const [darkMode, setDarkMode] = useState(false)
    const paletteType = darkMode ? "dark" : "light";

    const theme = createTheme({
        palette: {
            mode: paletteType,
            background: {
                default: paletteType === "light" ? "#eaeaea" : "#121212"
            }
        }
    })

    function handleThemeChange() {
        setDarkMode(!darkMode)
    }

    if (loading) {
        return <LoadingComponent message="Initialising app..."/>
    }

    return (
        <ThemeProvider theme={theme}>
            <ToastContainer position="bottom-right" hideProgressBar theme="colored"/>
            <CssBaseline/>
            <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
            <Container>
                <Outlet/>
            </Container>
        </ThemeProvider>
    )
}

export default App
