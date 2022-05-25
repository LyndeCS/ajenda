import React, { useState } from "react";
import "./css/Task.css";
import { Checkbox, TextField, IconButton, Button } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DateFnsUtils from "@date-io/date-fns"; //fixme: redundant import below
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function Task(props) {
	// add task button or double click should be only way to edit, one task at a time
	const [newDesc, setNewDesc] = useState(props.desc);
	const [isEditing, setEditing] = useState(props.desc ? false : true);

	// fixme: DatePicker separated from Task.js
	const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());

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

	function handleDateTimePickerClose(e) {
		setIsDateTimePickerOpen(false);
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
			<div className="task-button-container">
				{/* <IconButton
					aria-label="schedule"
					className="schedule-button"
					onClick={() => handleSchedule(props.id)}
				>
					<ScheduleIcon className="schedule-icon" />
				</IconButton> */}
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
			<div className="task-button-container">
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DateTimePicker
						open={isDateTimePickerOpen}
						onClose={handleDateTimePickerClose}
						value={selectedDate}
						onChange={setSelectedDate}
						renderInput={({
							ref,
							inputProps,
							disabled,
							onChange,
							value,
							...other
						}) => (
							<div ref={ref} {...other}>
								<input
									style={{ display: "none" }}
									value={value}
									onChange={onChange}
									disabled={disabled}
									{...inputProps}
								/>
								<IconButton
									aria-label="schedule"
									className="schedule-button"
									onClick={() => setIsDateTimePickerOpen((isOpen) => !isOpen)}
								>
									<ScheduleIcon className="schedule-icon" />
								</IconButton>
							</div>
						)}
					/>
				</LocalizationProvider>
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
