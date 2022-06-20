import React, { useState } from "react";
import {
	ViewState,
	EditingState,
	IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
	Scheduler,
	DayView,
	WeekView,
	MonthView,
	Toolbar,
	ViewSwitcher,
	DateNavigator,
	Appointments,
	AppointmentForm,
	AppointmentTooltip,
	ConfirmationDialog,
	TodayButton,
	CurrentTimeIndicator,
	DragDropProvider,
	EditRecurrenceMenu,
	AllDayPanel,
} from "@devexpress/dx-react-scheduler-material-ui";
import "./css/ScheduleView.css";
import classNames from "clsx";
import { styled } from "@mui/material/styles";
import { nanoid } from "nanoid";

const currentDate = new Date();
const currentHour = Math.min(currentDate.getHours(), 15.5);

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

const Appointment = ({ children, style, ...restProps }) => (
	<Appointments.Appointment
		{...restProps}
		style={{
			...style,
			backgroundColor: "#00BE91",
			fontSize: 14,
			fontFamily: "Quicksand",
		}}
	>
		{children}
	</Appointments.Appointment>
);

// const CustomTodayButton = ({ children, style, ...restProps }) => (
// 	<TodayButton.Button
// 		{...restProps}
// 		style={{
// 			...style,
// 			color: "white",
// 			backgroundColor: "#00BE91",
// 			fontSize: 14,
// 			fontFamily: "Quicksand",
// 		}}
// 	>
// 		{children}
// 	</TodayButton.Button>
// );

function ScheduleView(props) {
	function commitChanges({ added, changed, deleted }) {
		let data = props.appointments;
		if (added) {
			data = [...data, { id: "task-" + nanoid(), ...added }];
			props.addScheduledTask(added);
		}
		if (changed) {
			console.log(changed);
			data = data.map((appointment) =>
				changed[appointment.id]
					? { ...appointment, ...changed[appointment.id] }
					: appointment
			);
		}
		if (deleted !== undefined) {
			data = data.filter((appointment) => appointment.id !== deleted);
		}
		props.handleSchedulerChanges(data);
	}

	const TimeIndicator = ({ top, ...restProps }) => (
		<StyledDiv top={top} {...restProps}>
			<div className={classNames(classes.nowIndicator, classes.circle)} />
			<div className={classNames(classes.nowIndicator, classes.line)} />
		</StyledDiv>
	);

	return (
		<div className="schedule-container">
			<Scheduler data={props.appointments}>
				<ViewState />
				<EditingState onCommitChanges={commitChanges} />
				<IntegratedEditing />
				<EditRecurrenceMenu />
				<DayView startDayHour={0} endDayHour={24} />
				<WeekView startDayHour={0} endDayHour={24} />
				<MonthView />
				<ConfirmationDialog />
				<Toolbar />
				<DateNavigator />
				{/* <TodayButton buttonComponent={CustomTodayButton} /> */}
				<TodayButton />
				<ViewSwitcher />
				<Appointments appointmentComponent={Appointment} />
				<AppointmentTooltip showOpenButton showDeleteButton />
				<AppointmentForm />
				<AllDayPanel />
				<DragDropProvider />
				<CurrentTimeIndicator indicatorComponent={TimeIndicator} />
			</Scheduler>
		</div>
	);
}

export default ScheduleView;
