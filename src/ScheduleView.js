import React from "react";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
	Scheduler,
	DayView,
	MonthView,
	Toolbar,
	DateNavigator,
	Appointments,
	TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import "./css/ScheduleView.css";

const currentDate = new Date();
const currentHour = currentDate.getHours();

function ScheduleView(props) {
	const schedulerData = [
		{
			startDate: "2018-11-01T09:45",
			endDate: "2018-11-01T11:00",
			title: "Meeting",
		},
		{
			startDate: "2018-11-01T12:00",
			endDate: "2018-11-01T13:30",
			title: "Go to a gym",
		},
	];

	return (
		<div className="schedule-container">
			<Scheduler data={schedulerData}>
				<ViewState currentDate={currentDate} />
				<DayView startDayHour={currentHour} endDayHour={24} />
				<Toolbar />
				<DateNavigator />
				<TodayButton />
				<Appointments />
			</Scheduler>
		</div>
	);
}

export default ScheduleView;
