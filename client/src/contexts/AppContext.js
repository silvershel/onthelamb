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
        if (!currentUser) {
           fetch("/check_session")
               .then((r) => r.json())
               .then((user) => {
                //    console.log(user);
                   setCurrentUser(user);
               })
               .catch((error) => console.error("Error checking session:", error));
        }
      }, [currentUser]);

    // FETECH EVENTS
    useEffect(() => {
        fetch("/events")
            .then((r) => r.json())
            .then((events) => {
                // console.log(events);
                setEvents(events);
            })
            .catch((error) => console.error("Error fetching events:", error));
    }, []);

    useEffect(() => {
        const filterEvents = () => {
            let eventsList = [];
            if (filter === "my events") {
                eventsList = events.filter(event => event.user_id === currentUser.id);
            } else if (filter === "attending") {
                eventsList = events.filter(event => 
                event.attendees.some(attendee => attendee.user_id === currentUser.id)
                );
            } else {
                eventsList = events;
            }
          setFilteredEvents(eventsList);
        };
    
        filterEvents();
      }, [filter, events, currentUser]);

    // FETCH ATTENDEES
    useEffect(() => {
        fetch("/attendees")
            .then((r) => r.json())
            .then((attendees) => {
                // console.log(attendees);
                setAttendees(attendees);
            })
            .catch((error) => console.error("Error fetching attendees:", error));
    }, []);

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
            // console.log(user);
            setCurrentUser(user);
        })
        .catch((error) => console.error("Error logging in:", error));
    };

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
                // console.log(user);
                setUser(user);
            })
            .catch((error) => console.error("Error fetching user:", error));
    };

    // CREATE, UPDATE, DELETE EVENTS
    const createEvent = (newEvent) => {
        fetch('/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent),
        })
        .then((r) => r.json())
        .then((newEvent) => {
            // console.log(newEvent);
            setEvents((prevEvents) => [...prevEvents, newEvent]);

            createAttendee({
                comment: 'hello',
                user_id: newEvent.user_id,
                event_id: newEvent.id,
            });
        })
        .catch((error) => console.error('Error creating new event:', error));
    };

    const fetchEvent = (eventId) => {
        fetch(`/events/${eventId}`)
            .then((r) => r.json())
            .then((event) => {
                console.log(event);
                setEvent(event);
            })
            .catch((error) => console.error("Error fetching event:", error));
    };

    const updateEvent = (eventId, updatedEvent) => {
        fetch(`/events/${eventId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEvent),
        })
        .then((r) => r.json())
        .then((updatedEvent) => {
            console.log(updateEvent);
            setEvent(updatedEvent);
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === updatedEvent.id ? updatedEvent : event
                )
            );
        })
        .catch((error) => console.error('Error updating event:', error));
    };

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

    // CREATE, DELETE ATTENDEES
    const createAttendee = (newAttendee) => {
        fetch('/attendees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAttendee),
        })
        .then((r) => r.json())
        .then((newAttendee) => {
            // console.log(newAttendee);
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === newAttendee.event_id
                        ? {
                            ...event,
                            attendees: {
                                ...event.attendees,
                                [newAttendee.id]: newAttendee
                            }
                        }
                        : event
                )
            );
        })
        .catch((error) => console.error('Error creating new attendee:', error));
    };

    const deleteAttendee = (attendeeId) => {
        fetch(`/attendees/${attendeeId}`, { 
            method: 'DELETE' 
        })
        .then((r) => r.json())
        .then((deletedAttendee) => {
            console.log(deletedAttendee);
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                  event.attendees.some((attendee) => attendee.id === attendeeId)
                    ? {
                        ...event,
                        attendees: event.attendees.filter(
                          (attendee) => attendee.id !== attendeeId
                        ),
                      }
                    : event
                )
            );
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