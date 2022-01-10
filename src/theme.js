import { createTheme } from "@mui/material";

const theme = createTheme({
	palette: {
		primary: {
			main: "#00BE91",
			contrastText: "#fff",
		},
		secondary: {
			main: "#FFFFFF",
		},
		contrastThreshold: 3,
		tonalOffset: 0.2,
	},
	typography: {
		button: {
			textTransform: "none",
			fontWeight: 500,
			fontFamily: "Quicksand",
		},
	},
	// task: {
	// 	background: "#fff",
	// 	"&:hover": {
	// 		background: "#f00",
	// 	},
	// },
});

export default theme;
