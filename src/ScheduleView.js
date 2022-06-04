import React from "react";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
	Scheduler,
	DayView,
	WeekView,
	MonthView,
	Toolbar,
	ViewSwitcher,
	DateNavigator,
	Appointments,
	TodayButton,
	CurrentTimeIndicator,
} from "@devexpress/dx-react-scheduler-material-ui";
import "./css/ScheduleView.css";
import classNames from "clsx";
import { styled, alpha } from "@mui/material/styles";

const currentDate = new Date();
const currentHour = Math.min(currentDate.getHours(), 16);

//fixme: devexpress example
const PREFIX = "Demo";
const classes = {
	line: `${PREFIX}-line`,
	circle: `${PREFIX}-circle`,
	nowIndicator: `${PREFIX}-nowIndicator`,
	shadedCell: `${PREFIX}-shadedCell`,
	shadedPart: `${PREFIX}-shadedPart`,
	appointment: `${PREFIX}-appointment`,
	shadedAppointment: `${PREFIX}-shadedAppointment`,
};
const StyledDiv = styled("div", {
	shouldForwardProp: (prop) => prop !== "top",
})(({ theme, top }) => ({
	[`& .${classes.line}`]: {
		height: "2px",
		borderTop: `2px black solid`,
		width: "100%",
		transform: "translate(0, -1px)",
	},
	[`& .${classes.circle}`]: {
		width: theme.spacing(1.5),
		height: theme.spacing(1.5),
		borderRadius: "50%",
		transform: "translate(-50%, -50%)",
		background: "black",
	},
	[`& .${classes.nowIndicator}`]: {
		position: "absolute",
		zIndex: 1,
		left: 0,
		top,
	},
}));

function ScheduleView(props) {
	const schedulerData = props.tasks.map((task) => {
		return {
			startDate: task.startDate,
			endDate: task.endDate,
			title: task.desc,
		};
	});

	const TimeIndicator = ({ top, ...restProps }) => (
		<StyledDiv top={top} {...restProps}>
			<div className={classNames(classes.nowIndicator, classes.circle)} />
			<div className={classNames(classes.nowIndicator, classes.line)} />
		</StyledDiv>
	);

	return (
		<div className="schedule-container">
			<Scheduler data={schedulerData}>
				<ViewState currentDate={currentDate} />
				<DayView startDayHour={currentHour} endDayHour={24} />
				<WeekView startDayHour={currentHour} endDayHour={24} />
				<MonthView startDayHour={currentHour} endDayHour={24} />
				<Toolbar />
				<DateNavigator />
				<TodayButton />
				<ViewSwitcher />
				<Appointments />
				<CurrentTimeIndicator indicatorComponent={TimeIndicator} />
			</Scheduler>
		</div>
	);
}

export default ScheduleView;
