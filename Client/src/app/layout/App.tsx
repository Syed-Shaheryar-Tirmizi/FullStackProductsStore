import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css'
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { getBasketAsync } from "../../features/basket/basketSlice";
import { getCurrentUserAsync } from "../../features/Account/AccountSlice";

function App() {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  const initApp = useCallback(async () => {
    dispatch(getCurrentUserAsync())
    dispatch(getBasketAsync())
  }, [dispatch])

  useEffect(() => {
    initApp().then(() => setLoading(false))
  }, [initApp])

  const [darkMode, setDarkMode] = useState(false)
  const palette = darkMode ? 'dark' : 'light'

  const theme = createTheme({
    palette: {
      mode: palette,
      background: {
        default: palette === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  function handleThemeChange() {
    setDarkMode(!darkMode)
  }

  if(loading) return <LoadingComponent message="Initialising app..."/>

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App
