import React, { useState } from "react";
import TaskGroup from "./TaskGroup";
import { Divider, Button, ThemeProvider } from "@mui/material";
import "./css/TaskView.css";
import theme from "./theme";
import { nanoid } from "nanoid";

const GROUPS_DEFAULT = [
	{ name: "past", collapsed: false, section: "header" },
	{ name: "unscheduled", collapsed: false, section: "header" },
	{ name: "scheduled", collapsed: true, section: "footer" },
	{ name: "completed", collapsed: true, section: "footer" },
];

function TaskView(props) {
	const [input, setInput] = useState("");
	const [isEditing, setEditing] = useState(false);
	const [groups, setGroups] = useState(GROUPS_DEFAULT);

	function createTask() {
		props.addTask("");
		setEditing(true);
	}

	function handleGroups(e) {
		const updatedGroups = groups.map((group) => {
			if (group.name === e.target.className) {
				return {
					...group,
					collapsed: !group.collapsed,
				};
			}
			return group;
		});
		setGroups(updatedGroups);
	}

	const headerTaskGroups = groups
		.filter((group) => group.section === "header")
		.map((group) => (
			<TaskGroup
				key={group.name + nanoid()}
				tasks={props.tasks}
				name={group.name}
				collapsed={group.collapsed}
				handleGroups={handleGroups}
				completeTask={props.completeTask}
				saveTask={props.saveTask}
				deleteTask={props.deleteTask}
			/>
		));

	const footerTaskGroups = groups
		.filter((group) => group.section === "footer")
		.map((group) => (
			<TaskGroup
				key={group.name + nanoid()}
				tasks={props.tasks}
				name={group.name}
				collapsed={group.collapsed}
				handleGroups={handleGroups}
				completeTask={props.completeTask}
				saveTask={props.saveTask}
				deleteTask={props.deleteTask}
			/>
		));

	return (
		<div className="task-container">
			<div className="task-header">
				<h1>Tasks</h1>
			</div>
			<Divider />

			<div className="task-body">
				{headerTaskGroups}

				<ThemeProvider theme={theme}>
					<Button variant="contained" color="primary" onClick={createTask}>
						Add Task
					</Button>
				</ThemeProvider>
			</div>

			<div className="task-footer">
				<Divider />
				{footerTaskGroups}
			</div>
		</div>
	);
}

export default TaskView;
