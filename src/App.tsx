import { useEffect, useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import students from "./assets/students.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";

const exportPresentStudents = () => {
	// download the present students as a json file
	const dataStr = localStorage.getItem("presentStudents") || "[]";
	const dataUri =
		"data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

	const exportFileDefaultName = "presentStudents.json";

	const linkElement = document.createElement("a");
	linkElement.setAttribute("href", dataUri);
	linkElement.setAttribute("download", exportFileDefaultName);
	linkElement.click();
};

function App() {
	const [studentsMap, setStudentsMap] = useState(new Map());
	const [confirmation, setConfirmation] = useState(false);
	const [studentInfo, setStudentInfo]: any = useState({});
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// add event listeners for key presses
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	});

	const handleKeyDown = (e: any) => {
		// handle key presses
		if (e.key === "Enter") {
			// if confirmation and input field is not focused
			if (
				confirmation &&
				!inputRef.current?.contains(document.activeElement)
			) {
				// add the student to the present list in local storage
				const presentStudents = JSON.parse(
					localStorage.getItem("presentStudents") || "[]"
				);
				presentStudents.push(studentInfo);
				localStorage.setItem(
					"presentStudents",
					JSON.stringify(presentStudents)
				);
				// clear the input field
				inputRef.current!.value = "";
				// hide the confirmation message
				setConfirmation(false);
				// focus the input field
				console.log("Confirmed!");
				let first_name = studentInfo.name.split(" ")[0];
				toast.success(`Welcome ${first_name}!`, {
					theme: "dark",
					autoClose: 1400,
				});

				inputRef.current!.focus();
			}
			// if the input field is focused, toggle the confirmation message
			else if (inputRef.current?.contains(document.activeElement)) {
				setConfirmation(!confirmation);
				// unfocus the input field
				let studentEmail = inputRef.current!.value + "@fcpsschools.net";
				// if the student is not in the list, show an error message
				if (inputRef.current!.value === "") {
					toast.error("Please enter your student ID", {
						theme: "dark",
						autoClose: 1400,
					});
					setConfirmation(false);
					// clear the input field
					inputRef.current!.value = "";
					inputRef.current!.focus();
					return;
				}
				if (inputRef.current!.value === "export") {
					exportPresentStudents();
					setConfirmation(false);
					// clear the input field
					inputRef.current!.value = "";
					return;
				}
				if (inputRef.current!.value === "fullscreen") {
					document.documentElement.requestFullscreen();
					setConfirmation(false);
					// clear the input field
					inputRef.current!.value = "";
					return;
				}
				if (inputRef.current!.value === "clear") {
					localStorage.setItem("presentStudents", "[]");
					setConfirmation(false);
					// clear the input field
					inputRef.current!.value = "";
					return;
				}
				if (!studentsMap.has(studentEmail)) {
					toast.error("Student not found", {
						theme: "dark",
						autoClose: 1400,
					});
					setConfirmation(false);
					// clear the input field
					inputRef.current!.value = "";
					inputRef.current!.focus();
					return;
				}
				// if student is already present, show an error message
				const presentStudents = JSON.parse(
					localStorage.getItem("presentStudents") || "[]"
				);
				if (
					presentStudents.some(
						(student: any) => student.email === studentEmail
					)
				) {
					toast.error("Already present", {
						theme: "dark",
						autoClose: 1400,
					});
					setConfirmation(false);
					// clear the input field
					inputRef.current!.value = "";
					inputRef.current!.focus();
					return;
				}

				// if the input ref = "export", export the present students

				// clear the input field
				// get the student info
				setStudentInfo(studentsMap.get(studentEmail));

				inputRef.current!.blur();
			}
		} else if (e.key === "Backspace") {
			console.log("backspace");
			console.log(inputRef.current?.contains(document.activeElement));
			console.log(confirmation);
			// if confirmation and input field is not focused
			if (
				confirmation &&
				!inputRef.current?.contains(document.activeElement)
			) {
				// clear the input field
				inputRef.current!.value = "";
				// hide the confirmation message
				setConfirmation(false);
				// focus the input field
				inputRef.current!.focus();
				toast.error("Cancelled", {
					theme: "dark",
				});
			}
		}
	};

	useEffect(() => {
		// conver the array to a map
		setStudentsMap(
			new Map(students.map((student) => [student.email, student]))
		);
	}, []);
	const ordinal = (n: number) => {
		// returns a string with the number, and the correct ordinal suffix
		const s = ["th", "st", "nd", "rd"],
			v = n % 100;
		return n + (s[(v - 20) % 10] || s[v] || s[0]);
	};
	const nameFroademGrade = (grade: string) => {
		// returns a name based on the grade
		switch (grade) {
			case "09":
				return "freshman";
			case "10":
				return "sophomore";
			case "11":
				return "junior";
			case "12":
				return "senior";
		}
	};

	const formatGrade = (grade: string) => {
		// returns a formatted grade
		switch (grade) {
			case "09":
				return "9th";
			case "10":
				return "10th";
			case "11":
				return "11th";
			case "12":
				return "12th";
		}
	};

	return (
		<div className="App">
			<ToastContainer />
			<h1>Attendence</h1>
			{/* Input box to add a student to the present list */}
			<input
				type="text"
				className="studentID"
				placeholder="Enter your student ID"
				ref={inputRef}
			/>

			<AnimatePresence>
				{confirmation && (
					<motion.div
						className="darken"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{/* Darken the background when confirming */}
					</motion.div>
				)}

				{confirmation && (
					<motion.div
						className="confirmation"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{/* Confirmation message */}
						<h1>Press Enter to confirm, or Backspace to cancel</h1>
						<div className="studentInfo">
							{/* Student info */}
							<h2 className="name">{studentInfo.name}</h2>
							<h2
								className={`grade ${nameFroademGrade(
									studentInfo.grade
								)}`}
							>
								{formatGrade(studentInfo.grade)} Grade
							</h2>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default App;
