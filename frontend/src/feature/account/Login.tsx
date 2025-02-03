import {
    Avatar,
    Box,
    Button,
    Container,
    Grid2,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {LockOutlined} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import {FieldValues, useForm} from "react-hook-form";
import {useAppDispatch} from "../../app/store/configureStore.ts";
import {signInUser} from "./accountSlice.ts";

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const {register, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm({
        mode: "onTouched"
    })

    async function submitForm(data: FieldValues) {
        await dispatch(signInUser(data))
        navigate("/catalog")
    }

    return (
        <Container
            component={Paper}
            maxWidth="sm"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4
            }}>
            <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
                <LockOutlined/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit(submitForm)}
                noValidate sx={{mt: 1}}
            >
                <TextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    autoFocus
                    {...register("username", {required: "Username is required"})}
                    error={!!errors.username}
                    helperText={errors?.username?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    {...register("password", {required: "Password is required"})}
                    error={!!errors.password}
                    helperText={errors?.password?.message as string}
                />
                <Button
                    disabled={!isValid}
                    loading={isSubmitting}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                >
                    Sign in
                </Button>
                <Grid2 container>
                    <Grid2>
                        <Link to="/register">
                            Don't have an account? Sign up
                        </Link>
                    </Grid2>
                </Grid2>
            </Box>
        </Container>
    )
}