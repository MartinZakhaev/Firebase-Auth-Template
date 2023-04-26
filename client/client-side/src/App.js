import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterComplete from "./pages/auth/RegisterComplete";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Catalog from "./pages/Catalog";
import { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import harpelTheme from "./theme/HarpelTheme";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material";
import { auth } from "./firebaseConf";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <ThemeProvider theme={harpelTheme}>
        <CssBaseline />
        <Header />
        <ToastContainer />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/catalog" component={Catalog} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route
            exact
            path="/complete-registration"
            component={RegisterComplete}
          />
          <Route exact path="/forgot-password" component={ForgotPassword} />
        </Switch>
      </ThemeProvider>
    </>
  );
};

export default App;
