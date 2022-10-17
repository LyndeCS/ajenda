import React from "react";
import "./css/MobileFooter.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from "@mui/icons-material/Circle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";

const boxStyle = {
	bgcolor: "#00BE91",
	display: "flex",
	justifyContent: "space-around",
};

const taskViewButtonStyle = {
	color: "white",
};

const taskViewActiveButtonStyle = {
	color: "white",
	border: 3,
	borderRadius: "20%",
};

const scheduleViewButtonStyle = {
	color: "white",
};

const scheduleViewActiveButtonStyle = {
	color: "white",
	border: 3,
	borderRadius: "20%",
};

const StyledFab = styled(Fab)({
	position: "absolute",
	zIndex: 1,
	top: -30,
	left: 0,
	right: 0,
	margin: "0 auto",
});

function MobileFooter(props) {
	const handleAddTaskButton = (e) => {
		//fixme: should expand "Unscheduled" group if it is collapsed
		props.addTask("");
	};
	const handleTaskViewButton = (e) => {
		props.taskViewButton();
	};
	const handleScheduleViewButton = (e) => {
		props.scheduleViewButton();
	};

	return (
		// <div className="mobile-footer">
		// 	{/* <div className="mobile-footer-upper">
		// 		<IconButton
		// 			aria-label="add task"
		// 			className="mobile-add-task-button"
		// 			onClick={handleAddTaskButton}
		// 		>
		// 			<AddCircleIcon className="add-circle-icon" sx={addCircleIconStyle} />
		// 			<CircleIcon className="white-circle" sx={circleIconStyle} />
		// 		</IconButton>
		// 	</div> */}
		// 	<div className="mobile-footer-lower">
		// 		<Box sx={boxStyle}>
		// <IconButton
		// 	aria-label="task view"
		// 	className="task-view-button"
		// 	onClick={handleTaskViewButton}
		// >
		// 	<AssignmentIcon
		// 		sx={
		// 			props.taskViewActive
		// 				? taskViewActiveButtonStyle
		// 				: taskViewButtonStyle
		// 		}
		// 	/>
		// </IconButton>

		// <StyledFab
		// 	onClick={handleAddTaskButton}
		// 	aria-label="add task"
		// 	sx={{
		// 		color: "white",
		// 		backgroundColor: "#00BE91",
		// 		"&:hover": {
		// 			color: "white",
		// 			backgroundColor: "#029e79",
		// 		},
		// 	}}
		// >
		// 	<AddIcon />
		// </StyledFab>

		// <IconButton
		// 	aria-label="schedule view"
		// 	className="schedule-view-button"
		// 	onClick={handleScheduleViewButton}
		// >
		// 	<CalendarMonthIcon
		// 		sx={
		// 			props.scheduleViewActive
		// 				? scheduleViewActiveButtonStyle
		// 				: scheduleViewButtonStyle
		// 		}
		// 	/>
		// </IconButton>
		// 		</Box>
		// 	</div>
		// </div>
		<AppBar
			position="fixed"
			sx={{ top: "auto", bottom: 0, backgroundColor: "#00BE91" }}
		>
			<Toolbar>
				<IconButton
					aria-label="task view"
					className="task-view-button"
					onClick={handleTaskViewButton}
				>
					<AssignmentIcon
						sx={
							props.taskViewActive
								? taskViewActiveButtonStyle
								: taskViewButtonStyle
						}
					/>
				</IconButton>
				<StyledFab
					onClick={handleAddTaskButton}
					aria-label="add task"
					sx={{
						color: "white",
						backgroundColor: "#00BE91",
						"&:hover": {
							color: "white",
							backgroundColor: "#029e79",
						},
					}}
				>
					<AddIcon />
				</StyledFab>
				<Box sx={{ flexGrow: 1 }} />
				<IconButton
					aria-label="schedule view"
					className="schedule-view-button"
					onClick={handleScheduleViewButton}
				>
					<CalendarMonthIcon
						sx={
							props.scheduleViewActive
								? scheduleViewActiveButtonStyle
								: scheduleViewButtonStyle
						}
					/>
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}

export default MobileFooter;
