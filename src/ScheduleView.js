import React from "react";
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
	Resources,
	AllDayPanel,
} from "@devexpress/dx-react-scheduler-material-ui";
import "./css/ScheduleView.css";
import classNames from "clsx";
import { styled } from "@mui/material/styles";

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
	todayCell: `${PREFIX}-todayCell`,
	weekendCell: `${PREFIX}-weekendCell`,
	today: `${PREFIX}-today`,
	weekend: `${PREFIX}-weekend`,
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
			fontSize: 14,
			fontFamily: "Quicksand",
		}}
	>
		{children}
	</Appointments.Appointment>
);

const CustomTodayButton = ({ children, style, ...restProps }) => (
	<TodayButton.Button
		{...restProps}
		style={{
			...style,
			color: "black",
			backgroundColor: "white",
			fontSize: 16,
			fontFamily: "Quicksand",
			borderTop: 1,
			borderRight: 1,
			borderBottom: 1,
			borderLeft: 1,
			borderTopColor: "#00BE91",
			borderRightColor: "#00BE91",
			borderBottomColor: "#00BE91",
			borderLeftColor: "#00BE91",
		}}
	>
		{children}
	</TodayButton.Button>
);

const CustomNavigationButton = ({ children, style, ...restProps }) => (
	<DateNavigator.NavigationButton
		{...restProps}
		style={{
			...style,
			color: "black",
			fontFamily: "Quicksand",
		}}
	>
		{children}
	</DateNavigator.NavigationButton>
);

const CustomNavigatorOpenButton = ({ children, style, ...restProps }) => (
	<DateNavigator.OpenButton
		{...restProps}
		style={{
			...style,
			color: "black",
			fontSize: 16,
			fontFamily: "Quicksand",
		}}
	>
		{children}
	</DateNavigator.OpenButton>
);

const StyledDayViewDayScaleCell = styled(DayView.DayScaleCell)(({ theme }) => ({
	[`&.${classes.today}`]: {
		color: "#00BE91",
	},
}));

const StyledDayViewDayScaleRow = styled(DayView.DayScaleRow)(({ theme }) => ({
	[`&.${classes.today}`]: {
		color: "#00BE91",
	},
}));

const DayScaleCell = (props) => {
	const { startDate, today } = props;

	if (today) {
		return <StyledDayViewDayScaleCell {...props} className={classes.today} />;
	}
	if (startDate.getDay() === 0 || startDate.getDay() === 6) {
		return <StyledDayViewDayScaleCell {...props} className={classes.weekend} />;
	}
	return <StyledDayViewDayScaleCell {...props} />;
};

const DayScaleRow = (props) => {
	return <StyledDayViewDayScaleRow {...props} />;
};

function ScheduleView(props) {
	function commitChanges({ added, changed, deleted }) {
		console.log(props);
		if (added) {
			props.addAppointment(added);
		}
		if (changed) {
			props.changeAppointment(changed);
		}
		if (deleted !== undefined) {
			props.deleteAppointment(deleted);
		}
	}

	const TimeIndicator = ({ top, ...restProps }) => (
		<StyledDiv top={top} {...restProps}>
			<div className={classNames(classes.nowIndicator, classes.circle)} />
			<div className={classNames(classes.nowIndicator, classes.line)} />
		</StyledDiv>
	);

	const colors = [
		{
			text: "Mint",
			id: 1,
			color: "#00BE91",
		},
		{
			text: "Copper",
			id: 2,
			color: "#E58F65",
		},
		{
			text: "Red",
			id: 3,
			color: "#D05353",
		},
		{
			text: "Lilac",
			id: 4,
			color: "#797596",
		},
		{
			text: "Blue",
			id: 5,
			color: "#284C69",
		},
		{
			text: "Default",
			id: "",
			color: "#00BE91",
		},
	];

	const resources = [
		{
			fieldName: "colorId",
			title: "Colors",
			instances: colors,
		},
	];

	return (
		<div className="schedule-container">
			<Scheduler data={props.appointments}>
				<ViewState />
				<EditingState onCommitChanges={commitChanges} />
				<IntegratedEditing />
				<EditRecurrenceMenu />
				<DayView
					dayScaleRowComponent={DayScaleRow}
					dayScaleCellComponent={DayScaleCell}
					startDayHour={currentHour}
					endDayHour={24}
				/>
				<WeekView startDayHour={currentHour} endDayHour={24} />
				<MonthView />
				<ConfirmationDialog />
				<Toolbar />
				<DateNavigator
					openButtonComponent={CustomNavigatorOpenButton}
					navigationButtonComponent={CustomNavigationButton}
				/>
				<TodayButton buttonComponent={CustomTodayButton} />
				<ViewSwitcher />
				<Appointments appointmentComponent={Appointment} />
				<Resources data={resources} />
				<AppointmentTooltip showCloseButton showOpenButton showDeleteButton />
				<AppointmentForm />
				<AllDayPanel />
				<DragDropProvider />
				<CurrentTimeIndicator indicatorComponent={TimeIndicator} />
			</Scheduler>
		</div>
	);
}

export default ScheduleView;
