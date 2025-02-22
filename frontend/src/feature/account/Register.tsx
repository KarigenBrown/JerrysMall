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
import {useForm} from "react-hook-form";
import agent from "../../app/api/agent.ts";
import {toast} from "react-toastify";

export default function Register() {
    const navigate = useNavigate()
    const {register, handleSubmit, setError, formState: {isSubmitting, errors, isValid}} = useForm({
        mode: "onTouched"
    })

    function handleApiErrors(errors: any) {
        if (errors) {
            errors.forEach((error: string) => {
                    if (error.includes("Password")) {
                        setError("password", {message: error})
                    } else if (error.includes("Email")) {
                        setError("email", {message: error})
                    } else if (error.includes("Username")) {
                        setError("username", {message: error})
                    }
                }
            )
        }
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
                Register
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit(data => agent.Account.register(data)
                    .then(() => {
                        toast.success("Registration successful - you can now login")
                        navigate("/login")
                    })
                    .catch(error => handleApiErrors(error)))}
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
                    label="Email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/,
                            message: "Not a valid email address"
                        }
                    })}
                    error={!!errors.email}
                    helperText={errors?.email?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                        pattern: {
                            value: /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/,
                            message: "password does not meet complexity requirement"
                        }
                    })}
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
                    Register
                </Button>
                <Grid2 container>
                    <Grid2>
                        <Link to="/login" style={{textDecoration: "none"}}>
                            Already have an account? Sign In
                        </Link>
                    </Grid2>
                </Grid2>
            </Box>
        </Container>
    )
}