import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const EventProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);

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
    useEffect(() => { 
        fetch("/users")
            .then((r) => r.json())
            .then((users) => {
                console.log(users);
                setUsers(users);
            })
            .catch((error) => console.error("Error fetching users:", error));
    }, []);


    // FETCH USER
    const fetchUser = (username) => {
        fetch(`/users/${username}`)
            .then((r) => r.json())
            .then((user) => {
                console.log(user);
                setUsers(users);
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

    return (
        <UserContext.Provider
        value={{
            login,
            signup,
            logout,
            fetchUser,
            updateUser,
            currentUser,
            users,
            user,
        }}
        >
        {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);