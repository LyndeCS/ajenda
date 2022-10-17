import React, { useState } from "react";
import TaskGroup from "./TaskGroup";
import { Divider, Button, ThemeProvider, Box } from "@mui/material";
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
	const [groups, setGroups] = useState(GROUPS_DEFAULT);

	function createTask() {
		// expand Unscheduled group if it is collapsed
		if (
			groups.find((group) => group.name === "unscheduled" && group.collapsed)
		) {
			handleGroups("unscheduled");
		}

		// create task
		props.addTask("");
	}

	function handleGroups(e) {
		let groupName;
		if (typeof e === "string") {
			groupName = e;
		} else {
			groupName = e.currentTarget.id;
		}
		const updatedGroups = groups.map((group) => {
			if (group.name === groupName) {
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
				uncompleteTask={props.uncompleteTask}
				saveTask={props.saveTask}
				deleteTask={props.deleteTask}
				countTasks={props.countTasks}
				scheduleTask={props.scheduleTask}
				handleDnd={props.handleDnd}
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
				uncompleteTask={props.uncompleteTask}
				saveTask={props.saveTask}
				deleteTask={props.deleteTask}
				countTasks={props.countTasks}
				scheduleTask={props.scheduleTask}
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
					<Box textAlign="center">
						<Button
							className="add-task-button"
							variant="contained"
							color="primary"
							onClick={createTask}
							sx={{ minWidth: 120, width: 0.3, height: 32 }}
						>
							Add Task
						</Button>
					</Box>
				</ThemeProvider>
			</div>

			<Divider />
			<div className="task-footer">{footerTaskGroups}</div>
		</div>
	);
}

export default TaskView;
