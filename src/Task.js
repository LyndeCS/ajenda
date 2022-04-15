import React, { useState } from "react";
import "./css/Task.css";
import { Checkbox, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function Task(props) {
	const [isEditing, setEditing] = useState(props.desc === "" ? true : false);
	const [newDesc, setNewDesc] = useState(props.desc);

	function handleChange(e) {
		setNewDesc(e.target.value);
	}

	function handleSubmit(e) {
		e.preventDefault();
		props.saveTask(props.id, newDesc);
		setEditing(false);
	}

	function handleClick(e) {
		// double click task to edit
		switch (e.detail) {
			case 2:
				setEditing(true);
				break;
		}
	}

	function handleBlur(e) {
		setEditing(false);
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
					variant="standard"
					className="edit-task-input"
					value={newDesc}
					onChange={handleChange}
					autoFocus
					onBlur={handleBlur}
				/>
			</form>
			<IconButton
				aria-label="delete"
				className="delete-button"
				onClick={() => props.deleteTask(props.id)}
			>
				<DeleteIcon className="delete-icon" />
			</IconButton>
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
			<IconButton
				aria-label="delete"
				className="delete-button"
				onClick={() => props.deleteTask(props.id)}
			>
				<DeleteIcon className="delete-icon" />
			</IconButton>
		</li>
	);

	return isEditing ? editingTemplate : viewTemplate;
}

export default Task;
