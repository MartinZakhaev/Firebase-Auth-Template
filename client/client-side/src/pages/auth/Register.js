import * as yup from "yup";
import { styled } from "@mui/material/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
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
});

const Register = ({ history }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };
    try {
      await auth.sendSignInLinkToEmail(email, config);
      window.localStorage.setItem("emailForRegistration", email);
      setEmail("");
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
      reset();
    } catch (error) {
      alert(error);
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

  const registerForm = () => (
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
        <Button
          sx={{ mt: 3, mb: 2 }}
          fullWidth
          variant="contained"
          type="submit"
          disabled={!email || loading}
        >
          {loading ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            <Typography>Register</Typography>
          )}
        </Button>
        <Divider sx={{ mt: "20px", mb: "20px" }}>
          <Typography>
            Or already have an account?{" "}
            <Link href="/login" underline="none">
              Log in
            </Link>
          </Typography>
        </Divider>
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
          {registerForm()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register;
