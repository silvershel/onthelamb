import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [filter, setFilter] = useState("all");
    const [event, setEvent] = useState({});
    const [attendees, setAttendees] = useState([]);    
    const [user, setUser] = useState({});

    // CHECK SESSION
    useEffect(() => {
        if (!currentUser || !currentUser.id) {
            fetch("/check_session")
                .then((r) => r.json())
                .then((user) => {
                    console.log(user);
                    setCurrentUser(user);
                })
                .catch((error) => console.error("Error checking session:", error));
        }
    }, []);


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


    // FILTER EVENTS
    useEffect(() => {
        const filterEvents = () => {
            let eventsList = [];
            if (filter === "my events") {
                eventsList = events.filter(event => event.user_id === currentUser.id);
            } else if (filter === "attending") {
                eventsList = events.filter(event =>
                    // returns true for an event where an attendee.user_id === currentUser.id
                    event.attendees.some(attendee => attendee.user_id === currentUser.id)
                );
            } else {
                eventsList = events;
            }
          setFilteredEvents(eventsList);
        };
        filterEvents();
    }, [events, filter, currentUser]);


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
        .catch((error) => console.error("Error logging in:", error));
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
    }

    // LOGOUT
    const logout = () => {
        fetch("/logout", { method: "DELETE" })
        .then((r) => {
            if (r.ok) {
                setCurrentUser(null);
            }
        });
    };


    // FETCH USER
    const fetchUser = (username) => {
        fetch(`/users/${username}`)
            .then((r) => r.json())
            .then((user) => {
                console.log(user);
                setUser(user);
            })
            .catch((error) => console.error("Error fetching user:", error));
    };


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
                comment: 'hello',
                user_id: newEvent.user_id,
                event_id: newEvent.id,
            });
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
                currentUser,
                setCurrentUser,
                events,
                setEvents,
                filteredEvents,
                setFilter,
                event,
                fetchEvent,
                createEvent,
                updateEvent,
                deleteEvent,
                attendees,
                setAttendees,
                createAttendee,
                deleteAttendee,
                user,
                setUser,
                fetchUser,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return React.useContext(AppContext);
};