import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

function Profile() {
    const { currentUser, events, user, fetchUser } = useAppContext();
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

            <h1>{currentUser.id === user.id ? "My" : `${user.name}'s`} Events</h1>
            {userEvents.length > 0 ? (
                userEvents.map(event => 
                    <div>
                        <h2>{event.title}</h2>
                        <Link to={`/events/${event.id}`}>
                            <button>View Details</button>                
                        </Link>
                    </div>
                )
            ) : (
                <h2>No Events Found</h2>
            )}
            
        </div>
    )
}

export default Profile;