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
import {Link} from "react-router-dom";
import {useState} from "react";
import agent from "../../app/api/agent.ts";

export default function Login() {
    const [values, setValues] = useState({
        username: "",
        password: ""
    })

    function handleSubmit(event: any) {
        event.preventDefault()
        agent.Account.login(values)
    }

    function handleInputChange(event: any) {
        const {name, value} = event.target
        setValues({...values, [name]: value})
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
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    name="username"
                    autoFocus
                    onChange={handleInputChange}
                    value={values.username}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    onChange={handleInputChange}
                    value={values.password}
                />
                <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
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