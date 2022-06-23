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
		const startDate = new Date(start);
		const options = { month: "short" };
		let date = "";

		if (
			startDate.getDate() === today.getDate() &&
			startDate.getMonth() === today.getMonth() &&
			startDate.getFullYear() === today.getFullYear()
		) {
			date = "Today";
		} else {
			date = new Intl.DateTimeFormat("en-US", options)
				.format(startDate)
				.concat(" " + startDate.getDate());
		}

		return date;
	}

	const formattedDate = formatDate(props.startDate, props.endDate);

	//const formattedDate = "Today, 2:00 AM - 7:00 AM";
	const scheduledTask = <div className="timeframe">{formattedDate}</div>;

	return scheduledTask;
}

export default Timeframe;
