import React from "react";
import "./css/MobileFooter.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from "@mui/icons-material/Circle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";

const boxStyle = {
	bgcolor: "#00BE91",
	display: "flex",
	justifyContent: "space-around",
};

const taskViewButtonStyle = {
	color: "white",
	fontSize: 80,
};

const taskViewActiveButtonStyle = {
	color: "white",
	fontSize: 80,
	border: 3,
	borderRadius: "20%",
};

const scheduleViewButtonStyle = {
	color: "white",
	fontSize: 80,
};

const scheduleViewActiveButtonStyle = {
	color: "white",
	fontSize: 80,
	border: 3,
	borderRadius: "20%",
};

const addCircleIconStyle = {
	color: "#00BE91",
	fontSize: 110,
	position: "absolute",
	zIndex: 2,
};

const circleIconStyle = {
	color: "white",
	fontSize: 150,
	position: "absolute",
	zIndex: 1,
};

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
		<div className="mobile-footer">
			<div className="mobile-footer-upper">
				<IconButton
					aria-label="add task"
					className="mobile-add-task-button"
					onClick={handleAddTaskButton}
				>
					<AddCircleIcon className="add-circle-icon" sx={addCircleIconStyle} />
					<CircleIcon className="white-circle" sx={circleIconStyle} />
				</IconButton>
			</div>
			<div className="mobile-footer-lower">
				<Box sx={boxStyle}>
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
				</Box>
			</div>
		</div>
	);
}

export default MobileFooter;
