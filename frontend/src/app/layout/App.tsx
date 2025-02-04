import Header from "./Header.tsx";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import LoadingComponent from "./LoadingComponent.tsx";
import {fetchBasketAsync} from "../../feature/basket/basketSlice.ts";
import {fetchCurrentUserAsync} from "../../feature/account/accountSlice.ts";
import {useAppDispatch} from "../store/configureStore.ts";

function App() {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true)

    const initApp = useCallback(async () => {
        try {
            await dispatch(fetchCurrentUserAsync())
            await dispatch(fetchBasketAsync())
        } catch (error) {
            console.log(error)
        }
    }, [dispatch])

    useEffect(() => {
        initApp()
            .then(() => setLoading(false))
    }, [initApp]);

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
