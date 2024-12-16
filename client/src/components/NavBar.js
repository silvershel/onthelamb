import React from "react";
import { Link, useHistory } from "react-router-dom";

function NavBar({ currentUser, onLogout }) {
	const navigate = useHistory()

	function handleLogout(e) {
		fetch("/logout", { method: "DELETE" })
		.then((r) => {
			if (r.ok) {
				onLogout();
				resetSelect();
				navigate.push("/login");
			}
		});
	};

	function handleSelectChange(e) {
		const selection = e.target.value;

		if (selection === "dashboard") {
			navigate.push("/");
		} else if (selection === "view") {
			navigate.push(`/users/${currentUser.username}`);
			resetSelect();
		} else if (selection === "edit") {
			navigate.push("/profile/edit");
			resetSelect();
		} else if (selection === "create") {
			navigate.push("/create");
			resetSelect();
		} else if (selection === "logout") {
		  	handleLogout();
		}
	  }

	
	function resetSelect() {
		const selectElement = document.getElementById("dropdown");
		if (selectElement) {
		  selectElement.selectedIndex = 0;
		}
	  }

	return (
		<div>
			<h1>
				<Link to="/">On The Lamb</Link>
			</h1>
			<select id="dropdown" onChange={handleSelectChange}>
				<option value="dashboard">Dashboard</option>
				<option value="view">My Profile</option>
				<option value="edit">Edit Profile</option>
				<option value="create">Create Event</option>
				<option value="logout">Logout</option>
			</select>
		</div>
	);
};

export default NavBar;