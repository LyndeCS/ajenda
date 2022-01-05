import { createTheme } from "@mui/material";

const theme = createTheme({
	palette: {
		primary: {
			// light: will be calculated from palette.primary.main,
			main: "#00BE91",
			// dark: will be calculated from palette.primary.main,
			// contrastText: will be calculated to contrast with palette.primary.main
			contrastText: "#fff",
		},
		secondary: {
			main: "#FFFFFF",
			// dark: will be calculated from palette.secondary.main,
		},
		// Used by `getContrastText()` to maximize the contrast between
		// the background and the text.
		contrastThreshold: 3,
		// Used by the functions below to shift a color's luminance by approximately
		// two indexes within its tonal palette.
		// E.g., shift from Red 500 to Red 300 or Red 700.
		tonalOffset: 0.2,
	},
	typography: {
		button: {
			textTransform: "none",
			fontWeight: 300,
			fontFamily: "Quicksand",
		},
	},
});

export default theme;
