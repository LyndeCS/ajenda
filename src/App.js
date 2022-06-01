import React, { useState, useEffect } from "react";
import TaskView from "./TaskView";
import ScheduleView from "./ScheduleView";
import { nanoid } from "nanoid";
import "./css/App.css";

const LOCAL_STORAGE_KEY = "ajenda.tasks";

function App() {
	const [tasks, setTasks] = useState([]);

	function addTask(desc) {
		const newTask = {
			id: "task-" + nanoid(),
			desc: desc,
			completed: false,
			category: "unscheduled",
			startDate: "",
			endDate: "",
		};
		setTasks([...tasks, newTask]);
	}

	function saveTask(id, desc) {
		const updatedTasks = tasks.map((task) => {
			if (id === task.id) {
				return {
					...task,
					desc: desc,
				};
			}
			return task;
		});
		setTasks(updatedTasks);
	}

	function scheduleTask(id, scheduledStart, scheduledEnd) {
		const updatedTasks = tasks.map((task) => {
			if (id === task.id) {
				return {
					...task,
					startDate: scheduledStart,
					endDate: scheduledEnd,
					category: "scheduled",
				};
			}
			return task;
		});
		setTasks(updatedTasks);
	}

	//fixme: verbose, will need to check for past schedule
	function completeTask(id) {
		const updatedTasks = tasks.map((task) => {
			if (id === task.id) {
				if (!task.completed) {
					return {
						...task,
						completed: !task.completed,
						category: !task.completed ? "completed" : task.category,
					};
				} else if (task.startDate === "") {
					return {
						...task,
						completed: !task.completed,
						category: !task.completed ? "completed" : "unscheduled",
					};
				} else if (task.startDate !== "") {
					return {
						...task,
						completed: !task.completed,
						category: !task.completed ? "completed" : "scheduled",
					};
				}
			}
			return task;
		});
		setTasks(updatedTasks);
	}

	function deleteTask(id) {
		const taskToDelete = tasks.find((task) => task.id === id);

		// prompt to confirm delete if task has description
		if (taskToDelete.desc) {
			if (window.confirm("Delete?")) {
				setTasks(tasks.filter((task) => task.id !== id));
			}
		}

		// delete task without prompt if it has no description
		else {
			setTasks(tasks.filter((task) => task.id !== id));
		}
	}

	function countTasks(category) {
		const count = tasks.filter((task) => task.category === category).length;
		return count;
	}

	// load saved tasks from local storage, or create new array if one does not exist
	useEffect(() => {
		const storedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
		if (storedTasks) setTasks(storedTasks);
	}, []);
	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
	}, [tasks]);

	// check for past due tasks and update category to "past" if found
	//fixme: verbose
	useEffect(() => {
		const interval = setInterval(() => {
			const scheduledTasks = tasks.filter(
				(task) =>
					!task.completed &&
					task.category !== "past" &&
					Date.parse(task.endDate) < Date.now()
			);
			if (scheduledTasks.length > 0) {
				const updatedTasks = tasks.map((task) => {
					if (Date.parse(task.endDate) < Date.now() && !task.complete) {
						return {
							...task,
							category: "past",
						};
					}
					return task;
				});
				setTasks(updatedTasks);
			}
		}, 60 * 1000);
		return () => clearInterval(interval);
	}, [tasks]);

	return (
		<div className="App">
			<TaskView
				tasks={tasks}
				addTask={addTask}
				deleteTask={deleteTask}
				saveTask={saveTask}
				completeTask={completeTask}
				countTasks={countTasks}
				scheduleTask={scheduleTask}
			/>
			{/* fixme: task.category === "scheduled" */}
			<ScheduleView tasks={tasks.filter((task) => task.startDate)} />
		</div>
	);
}

export default App;
