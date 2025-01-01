import React from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";


function TopNav() {
	const { currentUser, logout } = useAppContext();
    const navigate = useHistory()

	return (
		<div>
			<div className="ui basic segment">
				<select className="ui selection dropdown">
					<option>select theme</option>
					<option>spring</option>
					<option>summer</option>
					<option>fall</option>
					<option>winter</option>
				</select>			
				<button className="ui right floated button" onClick={() => {logout(); navigate.push("/login")}}>LOGOUT</button>
				<button className="ui right floated button" onClick={() => navigate.push(`/dashboard`)}>DASHBOARD</button>
				<button className="ui right floated button" onClick={() => navigate.push("/events")}>EVENTS</button>
			</div>
		</div>
	);
};

export default TopNav;