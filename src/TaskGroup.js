import React, { useState } from "react";
import Task from "./Task";
import "./css/TaskGroup.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

function TaskGroup(props) {
	//fixme
	const [isCollapsed, setCollapsed] = useState(props.collapsed);

	const tasks = props.tasks
		.filter((task) => task.category === props.name)
		.map((task) => (
			<Task
				id={task.id}
				key={task.id}
				desc={task.desc}
				completed={task.completed}
				completeTask={props.completeTask}
				saveTask={props.saveTask}
				deleteTask={props.deleteTask}
				scheduleTask={props.scheduleTask}
			/>
		));

	const name =
		props.name.slice(0, 1).toUpperCase() +
		props.name.slice(1, props.name.length);

	const collapsedTemplate = (
		<div className="TaskGroup">
			<div
				id={props.name}
				className={"taskgroup-header"}
				onClick={props.handleGroups}
			>
				<h2 className={props.name}>
					{name} ({props.countTasks(props.name)})
				</h2>
				<ArrowDropDownIcon />
			</div>
		</div>
	);

	const expandedTemplate = (
		<div className="TaskGroup">
			<div
				id={props.name}
				className={"taskgroup-header"}
				onClick={props.handleGroups}
			>
				<h2>
					{name} ({props.countTasks(props.name)})
				</h2>
				<ArrowDropUpIcon />
			</div>
			<ul>{tasks}</ul>
		</div>
	);

	return isCollapsed ? collapsedTemplate : expandedTemplate;
}

export default TaskGroup;
