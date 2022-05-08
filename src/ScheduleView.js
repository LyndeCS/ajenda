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
	const schedulerData = props.tasks.map((task) => {
		return {
			startDate: task.startDate,
			endDate: task.endDate,
			title: task.desc,
		};
	});

	// const schedulerData = [
	// 	{
	// 		startDate: currentDate,
	// 		endDate: currentDate,
	// 		title: "Meeting",
	// 	},
	// 	{
	// 		startDate: currentDate,
	// 		endDate: currentDate,
	// 		title: "Go to a gym",
	// 	},
	// ];

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
