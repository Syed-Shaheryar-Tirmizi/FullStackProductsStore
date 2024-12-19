import { useEffect, useState } from "react";
import Header from "./Header";
import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css'
import { useStoreContext } from "../context/StoreContext";
import agent from "../api/agent";
import { getCookie } from "../util/util";
import LoadingComponent from "./LoadingComponent";

function App() {
  const {setBasket} = useStoreContext()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const buyerId = getCookie('buyerId')
    if (buyerId) {
      agent.basket.getBasket()
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    }
    else {
      setLoading(false)
    }
  }, [setBasket])

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
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App
