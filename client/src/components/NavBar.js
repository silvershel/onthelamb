import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";


function NavBar() {
	const { currentUser, logout } = useAppContext();
	const navigate = useHistory()

	function handleSelectChange(e) {
		const selection = e.target.value;

		if (selection === "dashboard") {
			navigate.push("/");
		} else if (selection === "view") {
			navigate.push(`/users/${currentUser.username}`);
			resetSelect();
		} else if (selection === "edit") {
			// this will need to get updated to "/profile/${currentUser.username}/edit"
			navigate.push("/profile/edit");
			resetSelect();
		} else if (selection === "create") {
			navigate.push("/create");
			resetSelect();
		} else if (selection === "logout") {
			navigate.push("/login");
		  	logout();
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