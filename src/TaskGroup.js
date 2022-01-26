import React, { useState } from "react";
import Task from "./Task";
import "./css/TaskView.css";

function TaskGroup(props) {
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

	return (
		<div className="TaskGroup">
			<h2 className={props.name} onClick={props.handleGroups}>
				{name}
			</h2>
			<ul className={props.collapsed ? "collapsed" : "expanded"}>{tasks}</ul>
		</div>
	);
}

export default TaskGroup;
