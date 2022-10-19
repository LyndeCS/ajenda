import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import { ThemeProvider } from "@mui/material/styles";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import theme from "./theme";

export default function Navbar(props) {
	const [error, setError] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const [scrollTarget, setScrollTarget] = useState(undefined);
	const { currentUser, logout } = useAuth();
	const navigate = useNavigate();

	function HideOnScroll(props) {
		const { children } = props;

		const trigger = useScrollTrigger({
			target: scrollTarget ? scrollTarget : undefined,
			threshold: 0,
		});

		return (
			<Slide appear={false} direction="down" in={!trigger}>
				{children}
			</Slide>
		);
	}

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

	useEffect(() => {
		if (props.isMobile) {
			const target = props.taskViewActive
				? document.getElementsByClassName("task-container")[0]
				: document.getElementsByClassName("MainLayout-container")[0];

			setScrollTarget(target);
		}
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<HideOnScroll>
				<AppBar elevation={2} position="fixed">
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
					</Toolbar>
				</AppBar>
			</HideOnScroll>
		</ThemeProvider>
	);
}
