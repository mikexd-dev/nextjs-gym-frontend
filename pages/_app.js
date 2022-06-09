import "../styles/globals.css";
import "../styles/Calendar.css";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#19857b",
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <MuiThemeProvider theme={theme}>
      <Component {...pageProps} />
      <CssBaseline />
    </MuiThemeProvider>
  );
}
export default MyApp;
