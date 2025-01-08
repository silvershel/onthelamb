import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [season, setSeason] = useState('winter');
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);
    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [ticket, setTicket] = useState([]);
    const [booths, setBooths] = useState([]);
    const [booth, setBooth] = useState([]);


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (storedUser) {
          setCurrentUser(storedUser);
        }
      }, []);

    // THEME SETTER
    useEffect(() => {
        if (currentUser) {
          const savedSeason = localStorage.getItem(`season-${currentUser.id}`);
          if (savedSeason) {
            setSeason(savedSeason);
          } else {
            setSeason('winter');
          }
        } else {
          setSeason('winter');
        }
      }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`season-${currentUser.id}`, season);
            const container = document.getElementById('app-container');
            if (container) {
                container.classList.remove('fall', 'spring', 'summer', 'winter');
                container.classList.add(season);
            }
        }
    }, [season, currentUser]);

    const handleThemeSelect = (e) => {
        setSeason(e.target.value);
    };

    // LOGIN
    const login = (user) => {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            localStorage.setItem('currentUser', JSON.stringify(user));
        })
        .catch((error) => {
            console.error('Signup error:', error);
          });
    };

    //SIGNUP
    const signup = (newUser) => {
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            localStorage.setItem('currentUser', JSON.stringify(user));
        })
        .catch((error) => console.error('Signup form error:', error));
    };

    // CHECK SESSION
    useEffect(() => { 
        fetch('/check_session')
            .then((r) => r.json())
            .then((user) => {
                console.log(user);
                setCurrentUser(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
            })
            .catch((error) => console.error('Error checking session:', error));
    }, []);

    // LOGOUT
    const logout = () => {
        fetch('/logout', { method: 'DELETE' })
        .then((r) => {
            if (r.ok) {
                setCurrentUser(null);
                localStorage.removeItem('currentUser');
            }
        });
    };

    // FETCH USERS
    useEffect(() => {
        fetch('/users')
        .then((r) => r.json())
        .then((users) => {
            console.log(users);
            setUsers(users);
        })
        .catch((error) => console.error('Error fetching users:', error));
    }, []);
    

    // FETCH USER
    const fetchUser = (username) => {
        fetch(`/users/${username}`)
            .then((r) => r.json())
            .then((user) => {
                console.log(user);
                setUser(user);
            })
            .catch((error) => console.error('Error fetching users:', error));
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
        })
        .catch((error) => console.error('Error updating event:', error));
    };

    // FETECH EVENTS
    useEffect(() => {
        fetch('/events')
        .then((r) => r.json())
        .then((events) => {
            console.log(events);
            setEvents(events);
        })
        .catch((error) => console.error('Error fetching events:', error));
    }, []);

    // FETCH EVENT
    const fetchEvent = (eventId) => {
        fetch(`/events/${eventId}`)
            .then((r) => r.json())
            .then((event) => {
                console.log(event);
                setEvent(event);
            })
            .catch((error) => console.error('Error fetching event:', error));
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
            setCurrentUser((prevUser) => ({
                ...prevUser,
                events: [...prevUser.events, newEvent]
            }));

            const newTicket = {
                comment: 'greetings, from your host!',
                user_id: currentUser.id,
                event_id: newEvent.id,
            }
            createTicket(newTicket, newEvent.id);
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
            setCurrentUser((prevUser) => ({
                ...prevUser,
                 events: events.map((event) =>
                    event.id === updatedEvent.id ? updatedEvent : event
                )
            }))
        })
        .catch((error) => console.error('Error updating event:', error));
    };
    
    // DELETE EVENT
    const deleteEvent = (eventId) => {
        fetch(`/events/${eventId}`, { method: 'DELETE' })
        .then((r) => {
            if (r.ok) {
                console.log(`Event ${eventId} deleted.`)
                setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
                setCurrentUser((prevUser) => ({
                    ...prevUser,
                    tickets: prevUser.tickets.filter(ticket => ticket.event.id !== eventId)
                }));
            } else {
                console.error('Unable to delete event.');
            }
        })
        .catch((error) => console.error('Error deleting event:', error));
    };

    // FETCH TICKETS
    useEffect(() => {
        fetch('/tickets')
        .then((r) => r.json())
        .then((tickets) => {
            console.log(tickets);
            setTickets(tickets);
        })
        .catch((error) => console.error('Error fetching tickets:', error));
    }, []);

    // FETCH TICKET
    const fetchTicket = (ticketId) => {
        fetch(`/tickets/${ticketId}`)
            .then((r) => r.json())
            .then((ticket) => {
                console.log(ticket);
                setTicket(ticket);
            })
            .catch((error) => console.error('Error fetching ticket:', error));
    };

    // CREATE TICKET
    const createTicket = (newTicket, eventId) => {
        fetch('/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTicket),
        })
        .then((r) => r.json())
        .then((newTicket) => {
            console.log(newTicket);
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === newTicket.event_id ?
                        { ...event, 
                            tickets: [ ...event.tickets, newTicket]

                        }
                        : event
                )
            );
            setCurrentUser((prevUser) => ({
                ...prevUser,
                tickets: [...prevUser.tickets, newTicket],
                events: prevUser.events.map((event) => 
                    event.id === newTicket.event_id
                        ? { 
                            ...event, 
                            tickets: [...event.tickets, newTicket]
                        }
                        : event
                ),
            }));
            fetchEvent(eventId);
        })
        .catch((error) => console.error('Error creating new ticket:', error));
    };

    // DELETE TICKET
    const deleteTicket = (ticketToDelete, eventId) => {
        fetch(`/tickets/${ticketToDelete.id}`, { 
            method: 'DELETE' 
        })
        .then((r) => r.json())
        .then(() => {
            console.log(ticketToDelete);
            setEvents((prevEvents) =>
                prevEvents.map((event) => 
                    event.id === eventId ?
                        {
                            ...event,
                            tickets: event.tickets.filter((ticket) => ticket.id !== ticketToDelete.id)
                        }
                        : event
                )
            );

            setCurrentUser((prevUser) => ({
                ...prevUser,
                tickets: prevUser.tickets.filter((ticket) => ticket.id !== ticketToDelete.id),
                events: prevUser.events.map((event) => ({
                    ...event,
                    tickets: event.tickets.filter((ticket) => ticket.id !== ticketToDelete.id)
            })),
        }));
            fetchEvent(eventId);
        })
        .catch((error) => console.error('Error deleting tickets:', error));
    };

    // FETCH BOOTHS
    useEffect(() => {
        fetch('/booths')
        .then((r) => r.json())
        .then((booths) => {
            console.log(booths);
            setBooths(booths);
        })
        .catch((error) => console.error('Error fetching booths:', error));
    }, []);

    // FETCH BOOTH
    const fetchBooth = (boothId) => {
        fetch(`/booths/${boothId}`)
            .then((r) => r.json())
            .then((booth) => {
                console.log(booth);
                setBooth(booth);
            })
            .catch((error) => console.error('Error fetching booth:', error));
    };


    return (
        <AppContext.Provider
            value={{
                season,
                handleThemeSelect,
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
                fetchTicket,
                createTicket,
                deleteTicket,
                tickets,
                ticket,
                fetchBooth,
                // createBooth,
                // deleteBooth,
                booths,
                booth,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return React.useContext(AppContext);
};