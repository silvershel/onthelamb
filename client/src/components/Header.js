import React from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";


function Header() {
	const { currentUser, logout } = useAppContext();
    const navigate = useHistory()

	return (
		<div className="ui basic center aligned very padded segment">
			<h3>on the lamb</h3>
            <p>Welcome, {currentUser.name}!</p>
            <button className="ui button" onClick={() => navigate.push("/")}>events</button>
            <button className="ui button" onClick={() => navigate.push(`/dashboard`)}>my dashboard</button>
            <button className="ui button" onClick={() => {logout(); navigate.push("/login")}}>logout</button>
		</div>
	);
};

export default Header;