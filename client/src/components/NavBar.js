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
		} else if (selection === "my profile") {
			navigate.push(`/users/${currentUser.username}`);
			resetSelect();
		} else if (selection === "edit profile") {
			// this will need to get updated to "/profile/${currentUser.username}/edit"
			navigate.push(`/profile/${currentUser.username}/edit`);
			resetSelect();
		} else if (selection === "create event") {
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
		<div class="ui basic center aligned very padded segment">
			<h1>
				<Link to="/">On The Lamb</Link>
			</h1>
			<select class="ui search dropdown" id="dropdown" onChange={handleSelectChange}>
				<option value="dashboard">Dashboard</option>
				<option value="my profile">My Profile</option>
				<option value="edit profile">Edit Profile</option>
				<option value="create event">Create Event</option>
				<option value="logout">Logout</option>
			</select>
		</div>
	);
};

export default NavBar;