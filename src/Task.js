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
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import theme from "./theme";
import Timeframe from "./Timeframe";
import { Draggable } from "react-beautiful-dnd";

//fixme: refactor
// schedule modal
const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 0.7,
	maxWidth: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 2,
	display: "flex",
	flexDirection: "column",
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
		setNextTimeSlotStart(new Date(getNextTimeSlotStart()));
		setNextTimeSlotEnd(new Date(getNextTimeSlotEnd()));
		setStartTime(new Date(getNextTimeSlotStart()));
		setEndTime(new Date(getNextTimeSlotEnd()));
		setModalOpen(true);
	}

	function handleScheduleSubmit(e) {
		const scheduledStartDate = startDate;
		const scheduledEndDate = endDate;
		scheduledStartDate.setHours(startTime.getHours());
		scheduledStartDate.setMinutes(startTime.getMinutes());
		scheduledStartDate.setSeconds(0);
		scheduledStartDate.setMilliseconds(0);

		scheduledEndDate.setHours(endTime.getHours());
		scheduledEndDate.setMinutes(endTime.getMinutes());
		scheduledEndDate.setSeconds(0);
		scheduledEndDate.setMilliseconds(0);

		props.scheduleTask(props.id, scheduledStartDate, scheduledEndDate);
		setScheduled(true);
	}

	function completeTask(e) {
		if (e.target.checked) {
			props.completeTask(props.id);
		} else {
			props.uncompleteTask(props.id);
		}
	}

	const editingTemplate = (
		<li className="task">
			<form className="task-edit-form" onSubmit={handleSubmit}>
				<Checkbox
					icon={<CheckBoxOutlineBlankRoundedIcon />}
					checkedIcon={<CheckBoxRoundedIcon />}
					sx={{
						color: "#00BE91",
						"&.Mui-checked": {
							color: "#00BE91",
						},
						"& .MuiSvgIcon-root": {
							fontSize: 20,
						},
					}}
					checked={props.completed ? true : false}
					onChange={completeTask}
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
					autoComplete="off"
				/>
			</form>
		</li>
	);

	const viewTemplate = (
		<li className="task" onClick={handleClick}>
			<Checkbox
				icon={<CheckBoxOutlineBlankRoundedIcon />}
				checkedIcon={<CheckBoxRoundedIcon />}
				sx={{
					color: "#00BE91",
					"&.Mui-checked": {
						color: "#00BE91",
					},
					"& .MuiSvgIcon-root": {
						fontSize: 20,
					},
				}}
				checked={props.completed ? true : false}
				onChange={completeTask}
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
			{isScheduled && <Timeframe startDate={startDate} endDate={endDate} />}
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
							<div className="start-pickers">
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
							</div>
							<div className="end-pickers">
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

	const dndViewTemplate = (
		<Draggable key={props.id} draggableId={props.id} index={props.index}>
			{(provided) => (
				<li
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className="task"
					onClick={handleClick}
				>
					<Checkbox
						icon={<CheckBoxOutlineBlankRoundedIcon />}
						checkedIcon={<CheckBoxRoundedIcon />}
						sx={{
							color: "#00BE91",
							"&.Mui-checked": {
								color: "#00BE91",
							},
							"& .MuiSvgIcon-root": {
								fontSize: 20,
							},
						}}
						checked={props.completed ? true : false}
						onChange={completeTask}
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
					{isScheduled && <Timeframe startDate={startDate} endDate={endDate} />}
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
									<div className="start-pickers">
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
									</div>
									<div className="end-pickers">
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
									</div>
								</LocalizationProvider>
								<ThemeProvider theme={theme}>
									<Button
										className="schedule-modal-button"
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
			)}
		</Draggable>
	);

	//return isEditing ? editingTemplate : viewTemplate;
	if (isEditing) {
		return editingTemplate;
	} else if (props.category === "unscheduled") {
		return dndViewTemplate;
	} else {
		return viewTemplate;
	}
}

export default Task;
