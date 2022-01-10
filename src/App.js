import React, { useState, useEffect } from "react";
import TaskView from "./TaskView";
import { nanoid } from "nanoid";

const LOCAL_STORAGE_KEY = "ajenda.tasks";

function App() {
	const [tasks, setTasks] = useState([]);

	function addTask(desc) {
		const newTask = {
			id: "task-" + nanoid(),
			desc: desc,
			completed: false,
			category: "unscheduled",
		};
		setTasks([...tasks, newTask]);
	}

	function saveTask(id, desc) {
		const updatedTasks = tasks.map((task) => {
			if (id === task.id) {
				return { ...task, desc: desc };
			}
			return task;
		});
		setTasks(updatedTasks);
	}

	function completeTask(id) {
		const updatedTasks = tasks.map((task) => {
			if (id === task.id) {
				return {
					...task,
					completed: !task.completed,
					category: !task.completed ? "completed" : task.category,
				};
			}
			return task;
		});
		setTasks(updatedTasks);
	}

	function deleteTask(id) {
		if (window.confirm("Delete?")) {
			setTasks(tasks.filter((task) => task.id !== id));
		}
	}

	function sortTasks() {
		const incompleteTasks = tasks.filter((task) => !task.completed);
		const completedTasks = tasks.filter((task) => task.completed);
		const sortedTasks = [...incompleteTasks, ...completedTasks];
		setTasks(sortedTasks);
	}

	useEffect(() => {
		const storedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
		if (storedTasks) setTasks(storedTasks);
	}, []);
	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
	}, [tasks]);

	return (
		<div className="App">
			<TaskView
				tasks={tasks}
				addTask={addTask}
				deleteTask={deleteTask}
				saveTask={saveTask}
				completeTask={completeTask}
				sortTasks={sortTasks}
			/>
		</div>
	);
}

export default App;
