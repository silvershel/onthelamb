import React from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";


function UserNav() {
	const { currentUser } = useAppContext();
	const navigate = useHistory()

	function handleSelectChange(e) {
		const selection = e.target.value;

		if (selection === "dashboard") {
			navigate.push("/dashboard");
		} else if (selection === "my profile") {
			navigate.push(`/users/${currentUser.username}`);
			resetSelect();
		} else if (selection === "edit profile") {
			navigate.push(`/users/${currentUser.username}/edit`);
			resetSelect();
		} else if (selection === "create event") {
			navigate.push("/create");
			resetSelect();
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
			<select class="ui search dropdown" id="dropdown" onChange={handleSelectChange}>
				<option value="dashboard">my dashboard</option>
				<option value="my profile">my profile</option>
				<option value="edit profile">edit profile</option>
				<option value="create event">create event</option>
			</select>
		</div>
	);
};

export default UserNav;