import * as yup from "yup";
import { styled } from "@mui/material/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { auth } from "../../firebaseConf";
import { toast } from "react-toastify";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid e-mail address")
    .required("E-mail address is a required field"),
  password: yup
    .string()
    .required("Password is a required field")
    .min(6, "Minimum password is 6 character")
    .max(8, "Maximum password is 8 character"),
});

const CompleteRegistration = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) history.push("/");
    setEmail(window.localStorage.getItem("emailForRegistration"));
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
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      if (result.user.emailVerified) {
        window.localStorage.removeItem("emailForRegistration");
        const user = auth.currentUser;
        await user.updatePassword(password);
        const idTokenResult = await user.getIdTokenResult();
        toast.success("Woohooo! Your account has been created!", {
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
      }
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

  const completeRegistrationForm = () => (
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
              <Typography>Complete registration</Typography>
            )}
          </Button>
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
          {completeRegistrationForm()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompleteRegistration;
