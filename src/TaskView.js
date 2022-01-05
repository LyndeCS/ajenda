import React, { useState } from "react";
import Task from "./Task";
import { Divider, Button, ThemeProvider } from "@mui/material";
import "./css/TaskView.css";
import theme from "./theme";

function TaskView(props) {
	const [input, setInput] = useState("");
	const [isEditing, setEditing] = useState(false);

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
			<h2>Past</h2>
			{pastTasks}
			<h2>Unscheduled</h2>
			{unscheduledTasks}
			<ThemeProvider theme={theme}>
				<Button variant="contained" color="primary" onClick={createTask}>
					Add Task
				</Button>
			</ThemeProvider>
			<div className="footer">
				<Divider />
				<h2>Scheduled</h2>
				{scheduledTasks}
				<h2>Completed</h2>
				{completedTasks}
			</div>
		</div>
	);
}

export default TaskView;
