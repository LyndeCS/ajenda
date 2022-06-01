import React from "react";
import "./css/Timeframe.css";

function Timeframe(props) {
	//get props of start/end date
	//format into Today, 2:00 AM - 7:00 AM

	// date options
	// Today
	// Mmm Day

	function formatDate(start, end) {
		const today = new Date();
		const options = { month: "short" };
		let date = "";
		if (
			start.getDate() === today.getDate() &&
			start.getMonth() === today.getMonth() &&
			start.getFullYear() === today.getFullYear()
		) {
			date = "Today";
		} else {
			date =
				new Intl.DateTimeFormat("en-US", options).format(start.getMonth()) +
				" " +
				start.getDate();
		}

		return date;
	}

	const formattedDate = formatDate(props.startDate, props.endDate);

	//const formattedDate = "Today, 2:00 AM - 7:00 AM";
	const scheduledTask = <div className="timeframe">{formattedDate}</div>;

	return scheduledTask;
}

export default Timeframe;
