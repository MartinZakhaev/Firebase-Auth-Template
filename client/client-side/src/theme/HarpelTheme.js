import { createTheme } from "@mui/material/styles";
const harpelTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5f17ef",
    },
    secondary: {
      main: "#9c27b0",
    },
    error: {
      main: "#d32f2f",
    },
    success: {
      main: "#2e7d32",
    },
    info: {
      main: "#0288d1",
    },
  },
});

export default harpelTheme;
