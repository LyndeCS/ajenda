import React, { useState } from "react";
import Task from "./Task";
import { Divider, Button, ThemeProvider } from "@mui/material";
import "./css/TaskView.css";
import theme from "./theme";

const GROUPS_DEFAULT = [
	{ name: "past", collapsed: false },
	{ name: "unscheduled", collapsed: false },
	{ name: "scheduled", collapsed: true },
	{ name: "completed", collapsed: true },
];

function TaskView(props) {
	const [input, setInput] = useState("");
	const [isEditing, setEditing] = useState(false);
	const [groups, setGroups] = useState(GROUPS_DEFAULT);

	function handleChange(e) {
		setInput(e.target.value);
	}

	function handleSubmit(e) {
		e.preventDefault();
		props.addTask(input);
		setInput("");
	}

	function createTask() {
		props.addTask("");
		setEditing(true);
	}

	function handleGroups(e) {
		console.log(e.target.className);
		const updatedGroups = groups.map((group) => {
			if (group.name === e.target.className) {
				return {
					...group,
					collapsed: !group.collapsed,
				};
			}
			return group;
		});
		console.log(groups);
		setGroups(updatedGroups);
	}

	const pastTasks = props.tasks
		.filter((task) => task.category === "past")
		.map((task) => (
			<Task
				id={task.id}
				key={task.id}
				desc={task.desc}
				completed={task.completed}
				completeTask={props.completeTask}
				saveTask={props.saveTask}
				deleteTask={props.deleteTask}
			/>
		));

	const unscheduledTasks = props.tasks
		.filter((task) => task.category === "unscheduled")
		.map((task) => (
			<Task
				id={task.id}
				key={task.id}
				desc={task.desc}
				completed={task.completed}
				completeTask={props.completeTask}
				saveTask={props.saveTask}
				deleteTask={props.deleteTask}
			/>
		));

	const scheduledTasks = props.tasks
		.filter((task) => task.category === "scheduled")
		.map((task) => (
			<Task
				id={task.id}
				key={task.id}
				desc={task.desc}
				completed={task.completed}
				completeTask={props.completeTask}
				saveTask={props.saveTask}
				deleteTask={props.deleteTask}
			/>
		));

	const completedTasks = props.tasks
		.filter((task) => task.category === "completed")
		.map((task) => (
			<Task
				id={task.id}
				key={task.id}
				desc={task.desc}
				completed={task.completed}
				completeTask={props.completeTask}
				saveTask={props.saveTask}
				deleteTask={props.deleteTask}
			/>
		));

	return (
		<div className="task-container">
			<div className="header">
				<h1>Tasks</h1>
			</div>
			<Divider />
			<h2 className="past">Past</h2>
			<ul className={"expanded"}>{pastTasks}</ul>
			<h2 className="unscheduled">Unscheduled</h2>
			<ul className={"expanded"}>{unscheduledTasks}</ul>
			<ThemeProvider theme={theme}>
				<Button variant="contained" color="primary" onClick={createTask}>
					Add Task
				</Button>
			</ThemeProvider>
			<div className="footer">
				<Divider />
				<h2 className="scheduled" onClick={handleGroups}>
					Scheduled
				</h2>
				<ul className={"expanded"}>{scheduledTasks}</ul>
				<h2 className="completed" onClick={handleGroups}>
					Completed
				</h2>
				<ul className={"expanded"}>{completedTasks}</ul>
			</div>
		</div>
	);
}

export default TaskView;
