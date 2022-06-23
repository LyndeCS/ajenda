import React from "react";
import "./css/MobileFooter.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from "@mui/icons-material/Circle";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";

function MobileFooter(props) {
	const handleMobileButton = (e) => {
		console.log("fired " + e);
	};

	return (
		<div className="mobile-footer">
			{/* <span className="colored-circle">
				<span className="vertical-line"></span>
				<span className="horizontal-line"></span>
			</span> */}
			<Box
				sx={{
					bgcolor: "#00BE91",
					width: 1,
					height: 1,
				}}
			>
				<IconButton
					aria-label="add task"
					className="mobile-button"
					onClick={handleMobileButton}
				>
					<AddCircleIcon
						className="add-circle-icon"
						style={{ color: "#00BE91", fontSize: 80 }}
					/>
				</IconButton>
			</Box>
			{/* <span className="white-circle"></span>
			<span className="rectangle"></span> */}
		</div>
	);
}

export default MobileFooter;
