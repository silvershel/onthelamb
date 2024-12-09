import React from "react";
import { Link, useHistory } from "react-router-dom";

function NavBar({ onLogout }) {
	const navigate = useHistory()

	function handleLogout(e) {
		fetch("/logout", { method: "DELETE" })
		.then((r) => {
			if (r.ok) {
				onLogout()
				navigate.push("/login");
			}
		});
	};

	return (
		<div>
			<h1>Nav Bar</h1>
			<div>
				<Link to="/">Home</Link>
				<Link to="/profile">Profile</Link>
				<button onClick={handleLogout}>Logout</button>
			</div>
		</div>
	);
};

export default NavBar;