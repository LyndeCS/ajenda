import React, { useState } from "react";
import "./css/Task.css";
import {
	Checkbox,
	TextField,
	IconButton,
	Button,
	Modal,
	Box,
	ThemeProvider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import theme from "./theme";
import Timeframe from "./Timeframe";

//fixme: refactor
const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

function Task(props) {
	// add task button or double click should be only way to edit, one task at a time
	const [newDesc, setNewDesc] = useState(props.desc);
	const [isEditing, setEditing] = useState(props.desc ? false : true);
	const [isScheduled, setScheduled] = useState(
		props.category === "scheduled" ? true : false
	);

	// modal
	const [isModalOpen, setModalOpen] = useState(false);
	const handleModalClose = () => setModalOpen(false);

	// fixme: DatePicker separated from Task.js?
	function getNextTimeSlotStart() {
		const currentDate = new Date();
		const currentMinutes = currentDate.getMinutes();
		if (currentMinutes < 30) {
			return currentDate.setMinutes(30);
		} else {
			currentDate.setHours(currentDate.getHours() + 1);
			return currentDate.setMinutes(0);
		}
	}
	function getNextTimeSlotEnd() {
		const currentDate = new Date();
		const currentMinutes = currentDate.getMinutes();
		if (currentMinutes < 30) {
			currentDate.setHours(currentDate.getHours() + 1);
			return currentDate.setMinutes(0);
		} else {
			currentDate.setHours(currentDate.getHours() + 1);
			return currentDate.setMinutes(30);
		}
	}

	const [nextTimeSlotStart, setNextTimeSlotStart] =
		useState(getNextTimeSlotStart);
	const [nextTimeSlotEnd, setNextTimeSlotEnd] = useState(getNextTimeSlotEnd);

	const [startDate, setStartDate] = useState(
		props.startDate ? new Date(props.startDate) : new Date()
	);
	const [endDate, setEndDate] = useState(
		props.endDate ? new Date(props.endDate) : new Date()
	);
	const [startTime, setStartTime] = useState(
		props.startDate ? new Date(props.startDate) : new Date()
	);
	const [endTime, setEndTime] = useState(
		props.endDate ? new Date(props.endDate) : new Date()
	);

	function handleChange(e) {
		setNewDesc(e.target.value);
	}

	function handleSubmit(e) {
		e.preventDefault();
		props.saveTask(props.id, newDesc);
	}

	function handleClick(e) {
		// double click task to edit
		switch (e.detail) {
			case 2:
				setEditing(true);
				break;
			default:
				break;
		}
	}

	function handleBlur(e) {
		if (newDesc) {
			setEditing(false);
			props.saveTask(props.id, newDesc);
		} else {
			props.deleteTask(props.id);
		}
	}

	function handleModalOpen(e) {
		setNextTimeSlotStart(getNextTimeSlotStart);
		setNextTimeSlotEnd(getNextTimeSlotEnd);
		setStartTime(getNextTimeSlotStart);
		setEndTime(getNextTimeSlotEnd);
		setModalOpen(true);
	}

	function handleScheduleSubmit(e) {
		const scheduledStartDate = new Date(startTime);
		const scheduledEndDate = new Date(endTime);
		scheduledStartDate.setSeconds(0);
		scheduledStartDate.setMilliseconds(0);
		scheduledEndDate.setSeconds(0);
		scheduledEndDate.setMilliseconds(0);

		props.scheduleTask(props.id, scheduledStartDate, scheduledEndDate);
		setScheduled(true);
	}

	const editingTemplate = (
		<li className="task">
			<form onSubmit={handleSubmit}>
				<Checkbox
					sx={{
						color: "#00BE91",
						"&.Mui-checked": {
							color: "#00BE91",
						},
					}}
					checked={props.completed ? true : false}
					onClick={() => props.completeTask(props.id)}
				/>
				<div
					className={
						props.completed
							? "task-desc completed-true"
							: "task-desc completed-false"
					}
				></div>
				<TextField
					fullWidth
					variant="standard"
					className="edit-task-input"
					value={newDesc}
					onChange={handleChange}
					autoFocus
					onBlur={handleBlur}
					color="grey"
				/>
			</form>
			{/* <div className="task-button-container">
				<IconButton
					aria-label="schedule"
					className="schedule-button"
					onClick={() => handleSchedule(props.id)}
				>
					<ScheduleIcon className="schedule-icon" />
				</IconButton>
				<IconButton
					aria-label="delete"
					className="delete-button"
					onClick={() => props.deleteTask(props.id)}
				>
					<DeleteIcon className="delete-icon" />
				</IconButton>
			</div> */}
		</li>
	);

	const viewTemplate = (
		<li className="task" onClick={handleClick}>
			<Checkbox
				sx={{
					color: "#00BE91",
					"&.Mui-checked": {
						color: "#00BE91",
					},
				}}
				checked={props.completed ? true : false}
				onClick={() => props.completeTask(props.id)}
			/>
			<div
				className={
					props.completed
						? "task-desc completed-true"
						: "task-desc completed-false"
				}
			>
				{props.desc}
			</div>
			{isScheduled && (
				<Timeframe startDate={props.startDate} endDate={props.endDate} />
			)}
			<div className="task-button-container">
				<IconButton
					aria-label="schedule"
					className="schedule-button"
					onClick={handleModalOpen}
				>
					<ScheduleIcon className="schedule-icon" />
				</IconButton>
				<Modal open={isModalOpen} onClose={handleModalClose}>
					<Box sx={style}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<div className="start-date-picker">
								<DatePicker
									label="Start Date"
									value={startDate}
									onChange={(newValue) => {
										setStartDate(newValue);
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</div>
							<div className="end-date-picker">
								<DatePicker
									label="End Date"
									value={endDate}
									onChange={(newValue) => {
										setEndDate(newValue);
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</div>
							<div className="start-time-picker">
								<TimePicker
									label="Start Time"
									value={startTime}
									onChange={(newValue) => {
										setStartTime(newValue);
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</div>
							<div className="end-time-picker">
								<TimePicker
									label="End Time"
									value={endTime}
									onChange={(newValue) => {
										setEndTime(newValue);
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</div>
						</LocalizationProvider>
						<ThemeProvider theme={theme}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleScheduleSubmit}
							>
								Schedule Task
							</Button>
						</ThemeProvider>
					</Box>
				</Modal>
				<IconButton
					aria-label="delete"
					className="delete-button"
					onClick={() => props.deleteTask(props.id)}
				>
					<DeleteIcon className="delete-icon" />
				</IconButton>
			</div>
		</li>
	);

	return isEditing ? editingTemplate : viewTemplate;
}

export default Task;
