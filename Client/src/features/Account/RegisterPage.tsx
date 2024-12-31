import { LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Container, Grid2, Paper, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";

export default function RegisterPage() {

    const navigate = useNavigate()
    const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid } } = useForm({
        mode: 'onTouched'
    })

    const handleApiErrors = (apiResponse: any) => {
        if (apiResponse?.data) {
            apiResponse.data.forEach((error: any) => {
                if (error.code.includes('Password')) {
                    setError('password', { message: error.description });
                } else if (error.code.includes('Email')) {
                    setError('email', { message: error.description });
                } else if (error.code.includes('UserName')) {
                    setError('username', { message: error.description });
                }
            });
        }
    };
    

    return (
        <Container component={Paper} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }} maxWidth="sm">
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign Up
            </Typography>
            <Box component={'form'}
                onSubmit={handleSubmit((data) => agent.account.register(data)
                    .then(() => {
                        toast.success('Registration successful - you can now login')
                        navigate('/login')
                    })
                    .catch(error => handleApiErrors(error)))
                } noValidate sx={{ mt: 1 }}>
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
                    label="Email"
                    {...register('email', { required: 'Email is required' })}
                    error={!!errors.email}
                    helperText={errors.email?.message as string} />
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
                    Register
                </LoadingButton>
                <Grid2 container>
                    <Grid2>
                        <Link to='/login'>
                            Already have an account? Sign in
                        </Link>
                    </Grid2>
                </Grid2>
            </Box>
        </Container>
    )
}