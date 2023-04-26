import * as yup from "yup";
import { styled } from "@mui/material/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { auth, googleAuthProvider } from "../../firebaseConf";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const createOrUpdateUser = async (authToken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/create-or-update-user`,
    {},
    { headers: { authToken } }
  );
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid e-mail address")
    .required("E-mail address is a required field"),
  password: yup.string().required("Password is a required field"),
});

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = async (data) => {
    setLoading(true);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      createOrUpdateUser(idTokenResult.token)
        .then((res) => console.log("CREATE OR UPDATE RES", res))
        .catch();
      dispatch({
        type: "LOGGED_IN_USER",
        payload: {
          email: user.email,
          token: idTokenResult.token,
        },
      });
      toast.success("Woohoooo! Welcome aboard!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      history.push("/");
    } catch (error) {
      toast.error("Ooops! Something went wrong, please try again!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
    }
    reset();
  };

  const handleGoogle = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
        });
        toast.success("Woohoooo! Welcome aboard!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        history.push("/");
      })
      .catch((err) =>
        toast.error("Ooops! Something went wrong, please try again!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      );
  };

  const loginForm = () => (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component={"form"}
        sx={{ mt: 3 }}
        onSubmit={handleSubmit(onSubmitHandler)}
        noValidate
        autoComplete="false"
      >
        <Grid>
          <TextField
            autoFocus
            fullWidth
            sx={{ m: "15px", ml: "0px" }}
            error={errors.email ? true : false}
            type="email"
            required
            id="email-required"
            label="Email"
            size="small"
            value={email}
            {...register("email")}
            helperText={errors.email?.message}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            sx={{ m: "15px", ml: "0px" }}
            error={errors.password ? true : false}
            type="password"
            required
            id="password-required"
            label="Password"
            size="small"
            value={password}
            {...register("password")}
            helperText={errors.password?.message}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            sx={{ mt: 3, mb: 2 }}
            fullWidth
            variant="contained"
            type="submit"
            disabled={(!email && !password) || loading}
          >
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <Typography>Log in</Typography>
            )}
          </Button>

          <Divider sx={{ mt: "20px", mb: "20px" }}>
            <Typography>Or log in using</Typography>
          </Divider>
          <Container
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Box>
              <IconButton>
                <LinkedInIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton onClick={handleGoogle}>
                <GoogleIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton>
                <FacebookIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton>
                <GitHubIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton>
                <TwitterIcon />
              </IconButton>
            </Box>
          </Container>
        </Grid>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item>xs=6</Item>
        </Grid>
        <Grid item xs={6}>
          {loginForm()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
