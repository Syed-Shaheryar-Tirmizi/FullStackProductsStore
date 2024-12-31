import { LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Container, Grid2, Paper, TextField, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { logInUser } from "./AccountSlice";
import { useEffect } from "react";

export default function LoginPage() {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation();
    const { user } = useAppSelector(state => state.account)

    const { register, handleSubmit, formState: { isSubmitting, errors, isValid } } = useForm({
        mode: 'onTouched'
    })

    useEffect(() => {
        if (user) {
            navigate('/catalog');
        }
    }, [user, navigate]);

    async function submitForm(data: FieldValues) {
        await dispatch(logInUser(data))
        navigate(location.state?.from || '/catalog')
    }

    return (
        <Container component={Paper} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }} maxWidth="sm">
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component={'form'} onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    {...register('username', { required: 'Username is required' })}
                    error={!!errors.username}
                    helperText={errors.username?.message as string}
                    autoFocus />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    error={!!errors.password}
                    helperText={errors.password?.message as string} />

                <LoadingButton
                    disabled={!isValid}
                    loading={isSubmitting}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}>
                    Login
                </LoadingButton>
                <Grid2 container>
                    <Grid2>
                        <Link to='/register'>
                            Don't have an account? Sign Up
                        </Link>
                    </Grid2>
                </Grid2>
            </Box>
        </Container>
    )
}