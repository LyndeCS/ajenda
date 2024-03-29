import React, { useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { useAuth } from "./contexts/AuthContext";
import { Link as RrdLink, useNavigate } from "react-router-dom";

export default function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();
	const { login, loginAnonymously } = useAuth();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();

		const loginType = e.nativeEvent.submitter.name;

		try {
			setError("");
			setLoading(true);
			if (loginType === "anonymous") {
				await loginAnonymously();
			} else {
				await login(emailRef.current.value, passwordRef.current.value);
			}
			setLoading(false);
			navigate("/");
		} catch {
			setError("Failed to sign in");
			setLoading(false);
		}
	}

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						{error && <Alert severity="error">{error}</Alert>}
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							inputRef={emailRef}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							inputRef={passwordRef}
						/>
						<FormControlLabel
							control={<Checkbox value="remember" color="primary" />}
							label="Remember me"
						/>
						<Button
							type="submit"
							name="sign-in"
							fullWidth
							variant="contained"
							disabled={loading}
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In
						</Button>
						<Button
							type="submit"
							name="anonymous"
							fullWidth
							variant="contained"
							disabled={loading}
							sx={{
								mb: 2,
								backgroundColor: "#919191",
								"&:hover": {
									backgroundColor: "black",
								},
							}}
						>
							Continue without Signing In
						</Button>
						<Grid container>
							<Grid item xs>
								<RrdLink to="/forgot-password">
									<Link variant="body2">{"Forgot Password?"}</Link>
								</RrdLink>
							</Grid>
							<Grid item>
								<RrdLink to="/signup">
									<Link variant="body2">
										{"Don't have an account? Sign Up"}
									</Link>
								</RrdLink>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
