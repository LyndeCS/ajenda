import React, { useState } from "react";
import Task from "./Task";
import "./css/TaskGroup.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function TaskGroup(props) {
	//fixme: setCollapsed is never used
	const [isCollapsed, setCollapsed] = useState(props.collapsed);
	const [dndTaskList, setDndTaskList] = useState(
		props.tasks.filter((task) => task.category === "unscheduled")
	);

	function handleOnDragEnd(result) {
		if (!result.destination) return;
		const items = Array.from(dndTaskList);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);
		setDndTaskList(items);
		props.handleDnd(items);
	}

	const tasks = props.tasks
		.filter((task) => task.category === props.name)
		.map((task, index) => (
			<Task
				id={task.id}
				key={task.id}
				desc={task.desc}
				completed={task.completed}
				completeTask={props.completeTask}
				saveTask={props.saveTask}
				deleteTask={props.deleteTask}
				scheduleTask={props.scheduleTask}
				startDate={task.startDate}
				endDate={task.endDate}
				category={task.category}
				index={index}
			/>
		));

	const dndTasks = dndTaskList.map((task, index) => (
		<Task
			id={task.id}
			key={task.id}
			desc={task.desc}
			completed={task.completed}
			completeTask={props.completeTask}
			saveTask={props.saveTask}
			deleteTask={props.deleteTask}
			scheduleTask={props.scheduleTask}
			startDate={task.startDate}
			endDate={task.endDate}
			category={task.category}
			index={index}
		/>
	));

	const name =
		props.name.slice(0, 1).toUpperCase() +
		props.name.slice(1, props.name.length);

	const collapsedTemplate = (
		<div className={"TaskGroup " + props.name}>
			<div
				id={props.name}
				className={"taskgroup-header"}
				onClick={props.handleGroups}
			>
				<h2 className={props.name}>
					<span className="taskgroup-header-groupname">{name}</span> (
					{props.countTasks(props.name)})
				</h2>
				<ArrowDropDownIcon />
			</div>
		</div>
	);

	const expandedTemplate = (
		<div className={"TaskGroup " + props.name}>
			<div
				id={props.name}
				className={"taskgroup-header"}
				onClick={props.handleGroups}
			>
				<h2>
					<span className="taskgroup-header-groupname">{name}</span> (
					{props.countTasks(props.name)})
				</h2>
				<ArrowDropUpIcon />
			</div>
			<ul>{tasks}</ul>
		</div>
	);

	const dndExpandedTemplate = (
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<div className={"TaskGroup " + props.name}>
				<div
					id={props.name}
					className={"taskgroup-header"}
					onClick={props.handleGroups}
				>
					<h2>
						<span className="taskgroup-header-groupname">{name}</span> (
						{props.countTasks(props.name)})
					</h2>
					<ArrowDropUpIcon />
				</div>
				<Droppable droppableId="tasks">
					{(provided) => (
						<ul
							className="tasks"
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{dndTasks}
							{provided.placeholder}
						</ul>
					)}
				</Droppable>
			</div>
		</DragDropContext>
	);

	//return isCollapsed ? collapsedTemplate : expandedTemplate;
	if (isCollapsed) {
		return collapsedTemplate;
	} else if (props.name === "unscheduled") {
		return dndExpandedTemplate;
	} else {
		return expandedTemplate;
	}
}

export default TaskGroup;
