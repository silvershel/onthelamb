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
        <div class="ui stackable equal width grid">
            <div class="column">
                <img class="ui fluid circular image" alt="" src={user.profile_photo}/>
                <button class="ui button">update profile photo</button>
            </div>
            <div class="column">
                <h2>{user.username}</h2>
                <p>name: {user.name}</p>
                <p>bio:</p>

                <Link to={`/users/${user.username}/edit`}>
                    <button class="ui button">edit profile</button>
                </Link>
                <Link to={`/create`}>
                    <button class="ui button">create event</button>
                </Link>
            </div>


            <div class="equal width row">
                <h3>{currentUser.id === user.id ? "my" : `${user.name}'s`} events</h3>
            </div>
            <div class="equal width row">
                {userEvents.length > 0 ? (
                    userEvents.map(event => 
                        <div class="column" key={event.id}>
                            <h4>{event.title}</h4>
                            <Link to={`/events/${event.id}`}>
                                <button class="ui button">view details</button>                
                            </Link>
                        </div>
                    )
                ) : (
                    <h2>you don't have any events yet.</h2>
                )}
                </div>
        </div>
    )
}

export default Profile;