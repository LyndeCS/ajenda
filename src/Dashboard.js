import React, { useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useAuth } from "./contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

export default function Dashboard() {
	const [error, setError] = useState("");
	const { currentUser, logout } = useAuth();
	const navigate = useNavigate();

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
		<>
			{error && <Alert severity="error">{error}</Alert>}
			<strong>Email:</strong> {currentUser.email}
			<Button onClick={handleLogout}>Log Out</Button>
		</>
	);
}
