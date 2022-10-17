import React, { useState } from "react";
import Task from "./Task";
import "./css/TaskGroup.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { range, orderBy } from "lodash";

function TaskGroup(props) {
	//fixme: setCollapsed is never used
	const [isCollapsed, setCollapsed] = useState(props.collapsed);
	const [dndTaskList, setDndTaskList] = useState(
		props.tasks.filter((task) => task.category === "unscheduled")
	);

	function handleOnDragEnd(result) {
		const { destination, source } = result;

		if (!destination) return;
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const directionOfDrag =
			destination.index > source.index ? "GREATER" : "LESS";

		let affectedRange = [];
		if (directionOfDrag === "GREATER") {
			affectedRange = range(source.index, destination.index + 1);
		} else if (directionOfDrag === "LESS") {
			affectedRange = range(destination.index, source.index);
		}

		const reOrderedTasklist = dndTaskList.map((task) => {
			if (task.id === result.draggableId) {
				task.position = result.destination.index;
				return task;
			} else if (affectedRange.includes(task.position)) {
				if (directionOfDrag === "GREATER") {
					task.position = task.position - 1;
					return task;
				} else if (directionOfDrag === "LESS") {
					task.position = task.position + 1;
					return task;
				}
			} else {
				return task;
			}
		});
		setDndTaskList(reOrderedTasklist);
		props.handleDnd(reOrderedTasklist);
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
				uncompleteTask={props.uncompleteTask}
				saveTask={props.saveTask}
				deleteTask={props.deleteTask}
				scheduleTask={props.scheduleTask}
				startDate={task.startDate}
				endDate={task.endDate}
				category={task.category}
				index={index}
			/>
		));

	const dndTasks = orderBy(dndTaskList, "position").map((task) => (
		<Task
			id={task.id}
			key={task.id}
			desc={task.desc}
			completed={task.completed}
			completeTask={props.completeTask}
			uncompleteTask={props.uncompleteTask}
			saveTask={props.saveTask}
			deleteTask={props.deleteTask}
			scheduleTask={props.scheduleTask}
			startDate={task.startDate}
			endDate={task.endDate}
			category={task.category}
			index={task.position}
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
