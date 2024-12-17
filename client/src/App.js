import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

// components
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import EventDetails from "./components/EventDetails";
import EventEdit from "./components/EventEdit";
import EventCreate from "./components/EventCreate";
import EventList from "./components/EventList";
import Profile from "./components/Profile";
import ProfileEdit from "./components/ProfileEdit";
import ErrorPage from "./components/ErrorPage";

// context
import { AppProvider } from "./contexts/AppContext";

// styles
const containerStyle = {
  textAlign: 'center'
};

function App() {

	if (!currentUser) {
		return (
			<Router>
				<Switch>
					<Route path="/login" exact>
						<LoginForm style={containerStyle}/>
					</Route>
					<Route path="/signup" exact>
						<SignupForm style={containerStyle} />
					</Route>
					<Route path="/" exact>
						<Redirect to="/login" />
					</Route>
					<Route path="*" style={containerStyle} component={ErrorPage} />
				</Switch>
			</Router>
		);
	}

	return (
		<AppProvider>
			<Router>
				<div style={containerStyle}>
					<NavBar/>
					<Switch>
						<Route path="/login" exact>
							<Redirect to="/" />
						</Route>
						<Route path="/signup" exact>
							<Redirect to="/" />
						</Route>
						<Route path="/" exact>
							<EventList />
						</Route>
						<Route path="/events" exact>
							<EventList />
						</Route>
						<Route path="/events/:eventId" exact>
							<EventDetails />
						</Route>
						<Route path="/events/:eventId/edit" exact>
							<EventEdit />
						</Route>
						<Route path="/create" exact>
							<EventCreate />
						</Route>
						<Route path="/users/:username" exact>
							<Profile />
						</Route>
						<Route path="/profile/edit" exact component={ProfileEdit} />
						<Route path="*" component={ErrorPage} />
					</Switch>
				</div>
			</Router>
		</AppProvider>
	);
}

export default App;