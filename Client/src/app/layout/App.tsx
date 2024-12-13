import { useState } from "react";
import Header from "./Header";
import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";

function App() {
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

  function handleThemeChange(){
    setDarkMode(!darkMode)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App
