import React from "react";
import { Link } from "react-router-dom";
import EventPreview from "./EventPreview";


function Profile({ user, events }) {
    const userEvents = events.filter(event => user.id === event.user_id)

    return(
        <div>
            <h1>Welcome, {user.first_name}!</h1>
            {/* <p>First Name: {user.first_name}</p> */}
            {/* <p>Last Name: {user.last_name}</p> */}
            {/* <Link to={`/profile/edit`}>
                <button>Edit Profile</button>
            </Link> */}
            <Link to={`/create`}>
                <button>Create Event</button>
            </Link>
            <h1>{user.first_name}'s Events</h1>
            <div>
                {userEvents.length > 0 ? (
                    userEvents.map((event) => (
                        <EventPreview 
                            key={event.id} 
                            user={user}
                            event={event} 
                        />
                    ))
                ) : (
                    <>
                    <h2>No Events Found</h2>
                    </>
                )}
                </div>
            
        </div>
    )
}

export default Profile;