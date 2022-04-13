import React, { useState } from "react";
import Task from "./Task";
import "./css/TaskGroup.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

function TaskGroup(props) {
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
			/>
		));

	const name =
		props.name.slice(0, 1).toUpperCase() +
		props.name.slice(1, props.name.length);

	//create 2 taskgroup templates for collapsed/expanded and add uparrow/downarrow icons
	//add onhover point cursor
	const collapsedTemplate = (
		<div className="TaskGroup">
			<div className="taskgroup-header" onClick={props.handleGroups}>
				<h2 className={props.name}>{name}</h2>
				<ArrowDropDownIcon />
			</div>
		</div>
	);

	const expandedTemplate = (
		<div className="TaskGroup">
			<div className="taskgroup-header" onClick={props.handleGroups}>
				<h2 className={props.name}>{name}</h2>
				<ArrowDropUpIcon />
			</div>
			<ul className={"expanded"}>{tasks}</ul>
		</div>
	);

	return (
		// <div className="TaskGroup">
		// 	<h2 className={props.name} onClick={props.handleGroups}>
		// 		{name}
		// 	</h2>
		// 	<ul className={props.collapsed ? "collapsed" : "expanded"}>{tasks}</ul>
		// </div>
		<>{isCollapsed ? collapsedTemplate : expandedTemplate}</>
	);
}

export default TaskGroup;
