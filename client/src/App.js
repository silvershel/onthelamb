import React, { useContext } from "react";
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
import { AppProvider, useAppContext } from "./contexts/AppContext";

// styles
const containerStyle = {
  textAlign: 'center'
};

function App() {
	const { currentUser } = useAppContext();
  
	return (
	  <AppProvider>
		<Router>
		  <div style={{ textAlign: "center" }}>
			<Switch>
			  {!currentUser ? (
				<>
				  <Route path="/login" exact component={LoginForm} />
				  <Route path="/signup" exact component={SignupForm} />
				  <Route path="/" exact>
					<Redirect to="/login" />
				  </Route>
				</>
			  ) : (
				<>
				  <Route path="/events" exact component={EventList} />
				  <Route path="/events/:eventId" exact component={EventDetails} />
				  <Route path="/events/:eventId/edit" exact component={EventEdit} />
				  <Route path="/create" exact component={EventCreate} />
				  <Route path="/profile" exact component={Profile} />
				  <Route path="/profile/edit" exact component={ProfileEdit} />
				  <Route path="*" component={ErrorPage} />
				</>
			  )}
			</Switch>
		  </div>
		</Router>
	  </AppProvider>
	);
  }

export default App;