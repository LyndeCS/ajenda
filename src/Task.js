import React, { useState } from "react";
import "./css/Task.css";
import { Checkbox, TextField } from "@mui/material";

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
				/>
			</form>
		</li>
	);

	const viewTemplate = (
		<li className="task">
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
		</li>
	);

	return isEditing ? editingTemplate : viewTemplate; //todo: remove redundant html tags in templates
}

export default Task;
