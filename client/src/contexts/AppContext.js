import React, { createContext, useState, useEffect } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [attendees, setAttendees] = useState([]);

    useEffect(() => {
        fetch("/check_session")
            .then((r) => r.json())
            .then((user) => {
                console.log(user);
                setCurrentUser(user);
            })
            .catch((error) => console.error("Error fetching user:", error));
    }, []);

    // Fetch events on mount
    useEffect(() => {
        fetch("/events")
            .then((r) => r.json())
            .then((events) => {
                console.log(events);
                setEvents(events);
            })
            .catch((error) => console.error("Error fetching events:", error));
    }, []);

    // Fetch attendees on mount
    useEffect(() => {
        fetch("/attendees")
            .then((r) => r.json())
            .then((attendees) => {
                console.log(attendees);
                setAttendees(attendees);
            })
            .catch((error) => console.error("Error fetching attendees:", error));
    }, []);

    return (
        <AppContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                events,
                setEvents,
                attendees,
                setAttendees,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return React.useContext(AppContext);
};

export {AppContext, AppProvider};