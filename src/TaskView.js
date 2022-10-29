import React, { useState } from "react";
import TaskGroup from "./TaskGroup";
import { Divider, Button, ThemeProvider, Box } from "@mui/material";
import "./css/TaskView.css";
import theme from "./theme";
import { nanoid } from "nanoid";
import Toolbar from "@mui/material/Toolbar";

function TaskView({ groups, ...props }) {
	const headerTaskGroups = groups
		.filter((group) => group.section === "header")
		.map((group) => (
			<TaskGroup
				key={group.name + nanoid()}
				tasks={props.tasks}
				name={group.name}
				collapsed={group.collapsed}
				handleGroups={props.handleGroups}
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
				handleGroups={props.handleGroups}
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
			{props.isMobile && <Toolbar />}
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
							onClick={() => props.addTask("")}
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
