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

	function addAppointment(appointment) {
		const newTask = {
			id: "task-" + nanoid(),
			desc: appointment.title,
			completed: false,
			category: "scheduled",
			startDate: appointment.startDate,
			endDate: appointment.endDate,
		};
		setTasks([...tasks, newTask]);
	}

	function changeAppointment(appointment) {
		const idArr = Object.keys(appointment);
		const id = idArr[0];
		const changes = appointment[id];

		const updatedTasks = tasks.map((task) => {
			if (id === task.id) {
				return {
					...task,
					...changes,
				};
			}
			return task;
		});
		setTasks(updatedTasks);
	}

	function deleteAppointment(id) {
		setTasks(tasks.filter((task) => task.id !== id));
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

	// Check task completion and endDate to determine if past due
	function pastDue(task) {
		// if task is completed, it is not past due
		if (task.completed) {
			return false;
		}

		const endDate = new Date(task.endDate);
		const currentDate = new Date(Date.now());
		if (endDate < currentDate) {
			return true;
		}
		return false;
	}

	// load saved tasks from local storage, or create new array if one does not exist
	useEffect(() => {
		const storedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
		if (storedTasks) setTasks(storedTasks);
	}, []);
	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
	}, [tasks]);

	// check for past due tasks every minute
	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		// checks all tasks
	// 		// some tasks may not have start/end date
	// 		const updatedTasks = tasks.map((task) => {
	// 			if (task.category === "scheduled" && pastDue(task)) {
	// 				return {
	// 					...task,
	// 					category: "past",
	// 				};
	// 			}
	// 			return task;
	// 		});
	// 		setTasks(updatedTasks);
	// 	}, 60 * 1000);
	// 	return () => clearInterval(interval);
	// }, [tasks]);

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
			<ScheduleView
				tasks={tasks.filter((task) => task.category === "scheduled")}
				appointments={tasks
					.filter((task) => task.category === "scheduled")
					.map((task) => {
						return {
							startDate: task.startDate,
							endDate: task.endDate,
							title: task.desc,
							id: task.id,
						};
					})}
				addAppointment={addAppointment}
				changeAppointment={changeAppointment}
				deleteAppointment={deleteAppointment}
			/>
		</div>
	);
}

export default App;
