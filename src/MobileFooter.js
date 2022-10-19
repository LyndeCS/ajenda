import React from "react";
import "./css/MobileFooter.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";

const taskViewButtonStyle = {
	color: "white",
	border: 3,
	borderRadius: "20%",
	fontSize: 40,
	borderColor: "#00BE91",
};

const taskViewActiveButtonStyle = {
	color: "white",
	border: 3,
	borderRadius: "20%",
	fontSize: 40,
	borderColor: "white",
};

const scheduleViewButtonStyle = {
	color: "white",
	border: 3,
	borderRadius: "20%",
	fontSize: 40,
	borderColor: "#00BE91",
};

const scheduleViewActiveButtonStyle = {
	color: "white",
	border: 3,
	borderRadius: "20%",
	fontSize: 40,
	borderColor: "white",
};

const StyledFab = styled(Fab)({
	position: "absolute",
	zIndex: 3,
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
		<AppBar
			position="sticky"
			sx={{
				top: "auto",
				bottom: 0,
				backgroundColor: "#00BE91",
				paddingLeft: 4,
				paddingRight: 4,
			}}
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
					<AddIcon sx={{ fontSize: 35 }} />
				</StyledFab>
				<div className="fab-cradle"></div>
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
