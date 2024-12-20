import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import EventPreview from "./EventPreview";

function Profile() {
    const { events, user, fetchUser } = useAppContext();
    const { username } = useParams();

    useEffect(() => {
        fetchUser(username);
    }, [username]);

    const userEvents = events.filter(event => user.id === event.user_id);

    return(
        <div>
            <h1>{username}</h1>

            <img 
                alt="alt text" 
                src={user.profile_photo} 
            />
            
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
            {userEvents.length > 0 ? (
                userEvents.map(event => 
                    <EventPreview key={event.id} event={event} 
                />)
            ) : (
                <h2>No Events Found</h2>
            )}
            
        </div>
    )
}

export default Profile;