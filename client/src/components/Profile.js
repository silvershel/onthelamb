import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

function Profile() {
    const { currentUser, events, user, fetchUser } = useAppContext();
    const { username } = useParams();

    useEffect(() => {
        fetchUser(username);
    }, [username]);

    const userEvents = events.filter(event => event.user_id === user.id);

    return(
        <div class="ui equal width grid">
            <div class="column">
                <img class="ui fluid circular image" alt="" src={user.profile_photo}/>
                <button class="ui button">Update Profile Photo</button>
            </div>
            <div class="column">
                <h1>{user.username}</h1>
                <p>Name: {user.name}</p>
                <p>Bio:</p>

                <Link to={`/profile/${user.username}/edit`}>
                    <button class="ui button">Edit Profile</button>
                </Link>
                <Link to={`/create`}>
                    <button class="ui button">Create Event</button>
                </Link>
            </div>


            <div class="equal width row">
                <h1>{currentUser.id === user.id ? "My" : `${user.name}'s`} Events</h1>
            </div>
            <div class="equal width row">
                {userEvents.length > 0 ? (
                    userEvents.map(event => 
                        <div class="column" key={event.id}>
                            <h2>{event.title}</h2>
                            <Link to={`/events/${event.id}`}>
                                <button class="ui button">View Details</button>                
                            </Link>
                        </div>
                    )
                ) : (
                    <h2>No Events Found</h2>
                )}
                </div>
        </div>
    )
}

export default Profile;