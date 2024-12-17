import React , { useEffect, useState } from "react";
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

// styles
const containerStyle = {
  textAlign: 'center'
};

function App() {
	const [currentUser, setCurrentUser] = useState(null);
	const [events, setEvents] = useState([]);
	const [attendees, setAttendees] = useState([]);

	useEffect(() => {
		fetch("/check_session")
		.then((r) => {
		if (r.ok) {
			r.json().then((currentUser) => setCurrentUser(currentUser));
		}
		});
	}, [])

	useEffect(() => {
        fetch("/attendees")
        .then((r) => r.json())
        .then((attendees) => {
            console.log(attendees);
            setAttendees(attendees);
        })
        .catch((error) => console.error('Error fetching attendees:', error));
    }, [])

	useEffect(() => {
        fetch("/events")
        .then((r) => r.json())
        .then((events) => {
            console.log(events);
            setEvents(events);
        })
        .catch((error) => console.error('Error fetching events:', error));
    }, [])	

	function handleLogout() {
		setCurrentUser(null);
	};

	function handleCreateEvent(newEvent) {
		fetch('/events', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(newEvent),
		})
		  .then((r) => r.json())
		  .then((newEvent) => {
			console.log(newEvent);
			setEvents((prevEvents) => [...prevEvents, newEvent])
			const newAttendee = {
                comment: "hello",
                user_id: newEvent.user_id,
                event_id: newEvent.id
            }
            
            console.log(newAttendee);
            handleCreateAttendee(newAttendee);
		  })
		  .catch((error) => {
			console.error('Error creating new event:', error);
		  });
	  };

	function handleUpdateEvent(eventId, updatedEvent) {
        fetch(`/events/${eventId}`, {
            method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedEvent),
		})
        .then((r) => r.json())
		.then((updatedEvent) => {
			setEvents((prevEvents) => 
				prevEvents.map((event) =>
					event.id === updatedEvent.id ? updatedEvent : event
				)
			);
		})
		.catch((error) => {
			console.error("Error updating event:", error);
		});
    }

	function handleDeleteEvent(eventId) {
        fetch(`/events/${eventId}`, {
            method: 'DELETE',
        })
        .then(r => {
            if (r.ok) {
				console.log("Event deleted.")
				setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
            } else {
                console.error("Unable to delete event.");
            }
        })
        .catch(error => {
            console.error("Error deleting event:", error);
        });
    }

	function handleCreateAttendee(newAttendee) {
		fetch('/attendees', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(newAttendee),
		})
		  .then((r) => r.json())
		  .then((newAttendee) => {
			setAttendees((prevAttendees) => [...prevAttendees, newAttendee]);
		  })
		  .catch((error) => {
			console.error('Error creating new attendee:', error);
		  });
	  };
	
	function handleDeleteAttendee(attendeeId) {
        fetch(`/attendees/${attendeeId}`, {
            method: 'DELETE',
        })
        .then(r => {
            if (r.ok) {
				console.log("Attendee deleted.")
				setAttendees((prevAttendees) => prevAttendees.filter(attendee => attendee.id !== attendeeId));
            } else {
                console.error("Unable to delete attendee.");
            }
        })
        .catch(error => {
            console.error("Error deleting attendee:", error);
        });
    }

	if (!currentUser) {
		return (
			<Router>
				<Switch>
					<Route path="/login" exact>
						<LoginForm style={containerStyle} onLogin={setCurrentUser}/>
					</Route>
					<Route path="/signup" exact>
						<SignupForm style={containerStyle} onSignup={setCurrentUser} />
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
		<Router>
		<div style={containerStyle}>
			<NavBar currentUser={currentUser} onLogout={handleLogout}/>
			<Switch>
				<Route path="/login" exact>
					<Redirect to="/" />
				</Route>
				<Route path="/signup" exact>
					<Redirect to="/" />
				</Route>
				<Route path="/" exact>
					<EventList currentUser={currentUser} events={events} onAttend={handleCreateAttendee} />
				</Route>
				<Route path="/events" exact>
					<EventList currentUser={currentUser} events={events} onAttend={handleCreateAttendee} />
				</Route>
				<Route path="/events/:eventId" exact>
					<EventDetails currentUser={currentUser} attendees={attendees} onAttend={handleCreateAttendee} onDeleteAttend={handleDeleteAttendee} />
				</Route>
				<Route path="/events/:eventId/edit" exact>
					<EventEdit onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} />
				</Route>
				<Route path="/create" exact>
					<EventCreate currentUser={currentUser} onCreateEvent={handleCreateEvent} />
				</Route>
				<Route path="/users/:username" exact>
					<Profile currentUser={currentUser} events={events} />
				</Route>
				<Route path="/profile/edit" exact component={ProfileEdit} />
				<Route path="*" component={ErrorPage} />
			</Switch>
		</div>
		</Router>
	);
}

export default App;