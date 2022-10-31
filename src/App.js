import React, { useState, useEffect } from "react";
import TaskView from "./TaskView";
import ScheduleView from "./ScheduleView";
import MobileFooter from "./MobileFooter";
import Navbar from "./Navbar";
import Signup from "./Signup";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import { useAuth } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { db } from "./firebase";
import "./css/App.css";

const GROUPS_DEFAULT = [
	{ name: "past", collapsed: false, section: "header" },
	{ name: "unscheduled", collapsed: false, section: "header" },
	{ name: "scheduled", collapsed: true, section: "footer" },
	{ name: "completed", collapsed: true, section: "footer" },
];

function App() {
	const [tasks, setTasks] = useState([]);
	const [groups, setGroups] = useState(GROUPS_DEFAULT);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const [taskViewActive, setTaskViewActive] = useState(true);
	const [scheduleViewActive, setScheduleViewActive] = useState(
		isMobile ? false : true
	);
	const { currentUser } = useAuth();
	const [nextPosition, setNextPosition] = useState(1);

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

	function addTask(desc) {
		if (
			groups.find((group) => group.name === "unscheduled" && group.collapsed)
		) {
			handleGroups("unscheduled");
		}

		const newTask = {
			desc: desc,
			completed: false,
			category: "unscheduled",
			startDate: "",
			endDate: "",
			position: nextPosition,
			colorId: 1,
		};

		db.collection("users")
			.doc(currentUser.uid)
			.collection("tasks")
			.add(newTask);
	}

	function addAppointment(appointment) {
		if (appointment.startDate) {
			let sd = new Date(appointment.startDate);
			if (sd.getSeconds() > 55) {
				sd.setMinutes(sd.getMinutes() + 1);
			}
			sd.setSeconds(0, 0);
			appointment.startDate = sd;
		}
		if (appointment.endDate) {
			let ed = new Date(appointment.endDate);
			if (ed.getSeconds() > 55) {
				ed.setMinutes(ed.getMinutes() + 1);
			}
			ed.setSeconds(0, 0);
			appointment.endDate = ed;
		}

		const newTask = {
			desc: appointment.title ? appointment.title : "new appointment",
			completed: false,
			category: "scheduled",
			startDate: appointment.startDate,
			endDate: appointment.endDate,
			position: 0,
			colorId: appointment.colorId ? appointment.colorId : 1,
		};

		db.collection("users")
			.doc(currentUser.uid)
			.collection("tasks")
			.add(newTask);
	}

	function changeAppointment(appointment) {
		const idArr = Object.keys(appointment);
		const id = idArr[0];
		let changes = appointment[id].title
			? { desc: appointment[id].title, ...appointment[id] }
			: appointment[id];

		// Fixes for inaccurate times returned by scheduler
		// Sometimes date is returned as one second before the minute (0:59 seconds)
		// Rounds up, then removes seconds/milliseconds
		if (changes.startDate) {
			let sd = new Date(changes.startDate);
			if (sd.getSeconds() > 55) {
				sd.setMinutes(sd.getMinutes() + 1);
			}
			sd.setSeconds(0, 0);
			changes.startDate = sd;
		}
		if (changes.endDate) {
			let ed = new Date(changes.endDate);
			if (ed.getSeconds() > 55) {
				ed.setMinutes(ed.getMinutes() + 1);
			}
			ed.setSeconds(0, 0);
			changes.endDate = ed;
		}

		db.collection("users")
			.doc(currentUser.uid)
			.collection("tasks")
			.doc(id)
			.set(
				{
					...changes,
				},
				{ merge: true }
			);
	}

	function deleteAppointment(id) {
		db.collection("users")
			.doc(currentUser.uid)
			.collection("tasks")
			.doc(id)
			.delete();
	}

	function saveTask(id, desc) {
		db.collection("users").doc(currentUser.uid).collection("tasks").doc(id).set(
			{
				desc: desc,
			},
			{ merge: true }
		);
	}

	function scheduleTask(id, scheduledStart, scheduledEnd, color) {
		const currTask = tasks.find((task) => task.id === id);
		const pos = currTask.position;

		db.collection("users").doc(currentUser.uid).collection("tasks").doc(id).set(
			{
				startDate: scheduledStart,
				endDate: scheduledEnd,
				category: "scheduled",
				position: 0,
				colorId: color,
			},
			{ merge: true }
		);
		adjustTaskPositions(pos);
	}

	function completeTask(id) {
		const currTask = tasks.find((task) => task.id === id);
		const pos = currTask.position;

		db.collection("users").doc(currentUser.uid).collection("tasks").doc(id).set(
			{
				completed: true,
				category: "completed",
				position: 0,
			},
			{ merge: true }
		);
		adjustTaskPositions(pos);
	}

	function uncompleteTask(id) {
		const currTask = tasks.find((task) => task.id === id);

		db.collection("users")
			.doc(currentUser.uid)
			.collection("tasks")
			.doc(id)
			.update({
				completed: false,
				category: currTask.startDate === "" ? "unscheduled" : "scheduled",
				position: currTask.startDate === "" ? nextPosition : 0,
			});
	}

	function deleteTask(id) {
		const taskToDelete = tasks.find((task) => task.id === id);
		const pos = taskToDelete.position;

		// prompt to confirm delete if task has description
		if (taskToDelete.desc) {
			if (window.confirm("Delete?")) {
				db.collection("users")
					.doc(currentUser.uid)
					.collection("tasks")
					.doc(id)
					.delete();
				adjustTaskPositions(pos);
			}
		}

		// delete task without prompt if it has no description
		else {
			db.collection("users")
				.doc(currentUser.uid)
				.collection("tasks")
				.doc(id)
				.delete();
			adjustTaskPositions(pos);
		}
	}

	function countTasks(category) {
		const count = tasks.filter((task) => task.category === category).length;
		return count;
	}

	function handleDnd(updatedTasks) {
		let batch = db.batch();
		updatedTasks.forEach((task) => {
			const docRef = db
				.collection("users")
				.doc(currentUser.uid)
				.collection("tasks")
				.doc(task.id);
			batch.update(docRef, { position: task.position });
		});

		batch
			.commit()
			.then(() => {
				//console.log("Batch Commited.");
			})
			.catch(() => {
				console.log("DND Batch Error.");
			});
	}

	function adjustTaskPositions(pos) {
		if (pos > 0) {
			// db.collection("users")
			// 	.doc(currentUser.uid)
			// 	.collection("tasks")
			// 	.get()
			// 	.then((querySnapshot) => {
			// 		querySnapshot.forEach((doc) => {
			// 			if (doc.data().position > pos) {
			// db.collection("users")
			// 	.doc(currentUser.uid)
			// 	.collection("tasks")
			// 	.doc(doc.id)
			// 	.update({
			// 		position: doc.data().position - 1,
			// 	})
			// 	.catch((error) => {
			// 		console.error("Error updating document: ", error);
			// 	});
			// 			}
			// 		});
			// 	});

			let batch = db.batch();
			const tasksToUpdate = tasks.filter((task) => task.position > pos);
			tasksToUpdate.forEach((task) => {
				const docRef = db
					.collection("users")
					.doc(currentUser.uid)
					.collection("tasks")
					.doc(task.id);
				batch.update(docRef, { position: task.position - 1 });
			});

			batch
				.commit()
				.then(() => {
					//console.log("Batch Commited.");
				})
				.catch(() => {
					console.log("adjustTaskPosition Batch Error.");
				});
		}
	}

	const handleTaskButton = () => {
		setTaskViewActive(true);
		setScheduleViewActive(false);
	};

	const handleScheduleButton = () => {
		setTaskViewActive(false);
		setScheduleViewActive(true);
	};

	// A change to a task will cause a new snapshot and update the [tasks] state
	useEffect(() => {
		if (currentUser) {
			const unsubscribe = db
				.collection("users")
				.doc(currentUser.uid)
				.collection("tasks")
				.onSnapshot((snapshot) => {
					const taskArr = snapshot.docs.map((doc) => {
						const convertedStartDate =
							doc.data().startDate !== "" ? doc.data().startDate.toDate() : "";
						const convertedEndDate =
							doc.data().endDate !== "" ? doc.data().endDate.toDate() : "";
						return {
							id: doc.id,
							category: doc.data().category,
							completed: doc.data().completed,
							desc: doc.data().desc,
							startDate: convertedStartDate,
							endDate: convertedEndDate,
							position: doc.data().position,
							colorId: doc.data().colorId,
							//...doc.data(),
						};
					});
					setTasks(taskArr);

					let nextPos = 1;
					if (taskArr.length > 0) {
						nextPos =
							Math.max(
								...taskArr.map((task) => {
									return task.position ? task.position : 0;
								})
							) + 1;
					}
					setNextPosition(nextPos);
				});
			return () => {
				unsubscribe();
			};
		}
	}, [currentUser]);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				if (!isMobile) {
					setIsMobile(true);
					setScheduleViewActive(false);
					setTaskViewActive(true);
				}
			} else if (window.innerWidth > 768) {
				setIsMobile(false);
				setTaskViewActive(true);
				setScheduleViewActive(true);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [isMobile]);

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

	// check for past due tasks every minute
	useEffect(() => {
		const interval = setInterval(() => {
			const pastTasks = tasks.filter(
				(task) => task.category === "scheduled" && pastDue(task)
			);

			if (pastTasks) {
				pastTasks.forEach((task) => {
					db.collection("users")
						.doc(currentUser.uid)
						.collection("tasks")
						.doc(task.id)
						.update({
							category: "past",
						})
						.catch((error) => {
							console.error("Error updating document: ", error);
						});
				});
			}
		}, 60 * 1000);
		return () => {
			clearInterval(interval);
		};
	}, [tasks, currentUser]);

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<PrivateRoute>
							<div className="App">
								<Navbar
									isMobile={isMobile}
									taskViewActive={taskViewActive}
									scheduleViewActive={scheduleViewActive}
								/>
								<div className="view-container">
									{taskViewActive && (
										<TaskView
											tasks={tasks}
											groups={groups}
											handleGroups={handleGroups}
											addTask={addTask}
											deleteTask={deleteTask}
											saveTask={saveTask}
											completeTask={completeTask}
											uncompleteTask={uncompleteTask}
											countTasks={countTasks}
											scheduleTask={scheduleTask}
											handleDnd={handleDnd}
											isMobile={isMobile}
										/>
									)}
									{scheduleViewActive && (
										<ScheduleView
											appointments={tasks
												.filter((task) => task.category === "scheduled")
												.map((task) => {
													return {
														startDate: task.startDate,
														endDate: task.endDate,
														title: task.desc,
														id: task.id,
														colorId: task.colorId,
													};
												})}
											addAppointment={addAppointment}
											changeAppointment={changeAppointment}
											deleteAppointment={deleteAppointment}
										/>
									)}
								</div>
								{isMobile && (
									<MobileFooter
										addTask={addTask}
										taskViewButton={handleTaskButton}
										scheduleViewButton={handleScheduleButton}
										taskViewActive={taskViewActive}
										scheduleViewActive={scheduleViewActive}
									/>
								)}
							</div>
						</PrivateRoute>
					}
				/>
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
			</Routes>
		</Router>
	);
}

export default App;
