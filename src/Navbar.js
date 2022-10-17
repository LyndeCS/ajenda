import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider } from "@mui/material/styles";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import theme from "./theme";

export default function Navbar() {
	const [error, setError] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const { currentUser, logout } = useAuth();
	const navigate = useNavigate();

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	async function handleLogout() {
		setError("");

		try {
			await logout();
			navigate("/login");
		} catch {
			setError("Failed to log out");
		}
	}

	return (
		<ThemeProvider theme={theme}>
			<Box>
				<AppBar elevation={2} position="static">
					<Toolbar>
						<div>
							<IconButton
								size="large"
								edge="start"
								color="inherit"
								aria-label="menu"
								sx={{ mr: 2 }}
								onClick={handleMenu}
							>
								<MenuIcon />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
								keepMounted
								transformOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
								open={Boolean(anchorEl)}
								onClose={handleClose}
							>
								<MenuItem onClick={handleLogout}>Log Out</MenuItem>
							</Menu>
						</div>
						<Typography
							variant="h6"
							component="div"
							sx={{ flexGrow: 1, fontFamily: "Quicksand", fontSize: 20 }}
						>
							Ajenda
						</Typography>
						{/* <Button
							color="inherit"
							onClick={handleLogout}
							sx={{ fontSize: 20 }}
						>
							Log Out
						</Button> */}
					</Toolbar>
				</AppBar>
			</Box>
		</ThemeProvider>
	);
}
