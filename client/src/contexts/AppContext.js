import React, { createContext, useState, useEffect } from "react";
import { EventProvider } from "./EventContext";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState({});
    const [user, setUser] = useState({});
    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState({});

    // LOGIN
    const login = (user) => {
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password,
            }),
        })
        .then((r) => r.json())
        .then((user) => {
            console.log(user);
            setCurrentUser(user);
        })
        .catch((error) => {
            console.error("Signup error:", error);
          });
    };

    //SIGNUP
    const signup = (newUser) => {
        fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_type: newUser.user_type,
                name: newUser.name,
                username: newUser.username,
                password: newUser.password,
            }),
        })
        .then((r) => r.json())
        .then((user) => {
            console.log(user);
            setCurrentUser(user);
        })
        .catch((error) => console.error('Signup form error:', error));
    };

    // CHECK SESSION
    useEffect(() => { 
        fetch("/check_session")
            .then((r) => r.json())
            .then((user) => {
                console.log(user);
                setCurrentUser(user);
            })
            .catch((error) => console.error("Error checking session:", error));
    }, []);

    // LOGOUT
    const logout = () => {
        fetch("/logout", { method: "DELETE" })
        .then((r) => {
            if (r.ok) {
                setCurrentUser(null);
            }
        });
    };

    // FETCH USERS
    const fetchUsers = () => {
        fetch(`/users/`)
            .then((r) => r.json())
            .then((users) => {
                console.log(users);
                setUsers(users);
            })
            .catch((error) => console.error("Error fetching user:", error));
    };


    // FETCH USER
    const fetchUser = (username) => {
        fetch(`/users/${username}`)
            .then((r) => r.json())
            .then((user) => {
                console.log(user);
                setUser(users);
            })
            .catch((error) => console.error("Error fetching users:", error));
    };

    // UPDATE USER
    const updateUser = (updatedUser) => {
        fetch(`/users/${updatedUser.username}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser),
        })
        .then((r) => r.json())
        .then((updatedUser) => {
            console.log(updatedUser);
            setCurrentUser(updatedUser);

            setEvents((prevEvents) =>
                prevEvents.map((event) => ({
                    ...event,
                    attendees: event.attendees.map((attendee) =>
                        attendee.user_id === updatedUser.id ?
                            { ...attendee, user: updatedUser }
                            : attendee
                    ),
                }))
            );

        })
        .catch((error) => console.error('Error updating event:', error));
    };


    // FETECH EVENTS
    useEffect(() => {
        fetch("/events")
        .then((r) => r.json())
        .then((events) => {
            console.log(events);
            setEvents(events);
        })
        .catch((error) => console.error("Error fetching events:", error));
    }, []);

    // FETCH EVENT
    const fetchEvent = (eventId) => {
        fetch(`/events/${eventId}`)
            .then((r) => r.json())
            .then((event) => {
                console.log(event);
                setEvent(event);
            })
            .catch((error) => console.error("Error fetching event:", error));
    };

    // CREATE EVENT
    const createEvent = (newEvent) => {
        fetch('/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent),
        })
        .then((r) => r.json())
        .then((newEvent) => {
            console.log(newEvent);
            setEvents((prevEvents) => [...prevEvents, newEvent]);

            createAttendee({
                comment: 'greetings, from your host!',
                user_id: newEvent.user_id,
                event_id: newEvent.id,
            }, newEvent.id);
        })
        .catch((error) => console.error('Error creating new event:', error));
    };

    // UPDATE EVENT
    const updateEvent = (eventId, updatedEvent) => {
        fetch(`/events/${eventId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEvent),
        })
        .then((r) => r.json())
        .then((updatedEvent) => {
            console.log(updatedEvent);
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === updatedEvent.id ? updatedEvent : event
                )
            );
        })
        .catch((error) => console.error('Error updating event:', error));
    };
    
    // DELETE EVENT
    const deleteEvent = (eventId) => {
        fetch(`/events/${eventId}`, { method: 'DELETE' })
        .then((r) => {
            if (r.ok) {
                console.log(`Event ${eventId} deleted.`)
                setEvents((prevEvents) =>
                    prevEvents.filter((event) => event.id !== eventId)
                );
            } else {
                console.error('Unable to delete event.');
            }
        })
        .catch((error) => console.error('Error deleting event:', error));
    };

    // CREATE ATTENDEE
    const createAttendee = (newAttendee, eventId) => {
        fetch('/attendees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAttendee),
        })
        .then((r) => r.json())
        .then((newAttendee) => {
            console.log(newAttendee);
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === newAttendee.event_id ?
                        { ...event, attendees: 
                            { ...event.attendees, [newAttendee.id]: newAttendee}
                        }
                        : event
                )
            );
            fetchEvent(eventId);
        })
        .catch((error) => console.error('Error creating new attendee:', error));
    };

    // DELETE ATTENDEE
    const deleteAttendee = (attendeeToDelete, eventId) => {
        fetch(`/attendees/${attendeeToDelete.id}`, { 
            method: 'DELETE' 
        })
        .then((r) => r.json())
        .then(() => {
            console.log(attendeeToDelete);
            setEvents((prevEvents) =>
                prevEvents.map((event) => 
                    event.id === eventId ?
                        {
                            ...event,
                            attendees: event.attendees.filter((attendee) => attendee.id !== attendeeToDelete.id)
                        }
                        : event
                )
            );
            fetchEvent(eventId);
        })
        .catch((error) => console.error('Error deleting attendee:', error));
    };

    return (
        <AppContext.Provider
            value={{
                login,
                signup,
                logout,
                fetchUser,
                updateUser,
                currentUser,
                users,
                user,

                fetchEvent,
                createEvent,
                updateEvent,
                deleteEvent,
                events,
                event,

                createAttendee,
                deleteAttendee,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return React.useContext(AppContext);
};