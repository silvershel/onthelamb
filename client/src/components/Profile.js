import React, { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { Link, useParams } from "react-router-dom";
import EventPreview from "./EventPreview";

function Profile() {
    const { currentUser, events } = useAppContext();
    const { username } = useParams()
    const [user, setUser] = useState([])

    useEffect(() => {
        fetch(`/users/${username}`)
        .then((r) => r.json())
        .then((user) => {
            console.log(user);
            setUser(user);
        })
        .catch((error) => console.error('Error fetching user:', error));
    }, [username])

    const userEvents = events.filter(event => user.id === event.user_id)

    function showProfileGreeting() {
        if (currentUser.id === user.id) {
            return `Welcome, ${user.username}!`
        } else {
            return `${user.username}`
        }
    }

    function showUserEventsList() {
        if (userEvents.length > 0) {
            return userEvents.map((event) => (
                <EventPreview key={event.id} event={event}/>
            ))
        } else {
            return <h2>No Events Found</h2>
        }
    }

    return(
        <div>
            <h1>{showProfileGreeting()}</h1>
            <img alt="alt text" src="https://cdn.dribbble.com/userupload/17756893/file/original-aa925a9bb546f667dd24b56715c3da7e.png?format=webp&resize=400x300&vertical=center" style={{ width: '500px' }} />
            <button>Edit Profile Photo</button>
            <p>Name: {user.name}</p>
            <p>Bio:</p>

            <Link to={`/profile/edit`}>
                <button>Edit Profile</button>
            </Link>

            <Link to={`/create`}>
                <button>Create Event</button>
            </Link>

            <h1>{user.name}'s Events</h1>
            {showUserEventsList()}
            
        </div>
    )
}

export default Profile;