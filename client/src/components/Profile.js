import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

function Profile() {
    const { currentUser, events, user, fetchUser } = useAppContext();
    const { username } = useParams();

    useEffect(() => {
        fetchUser(username);
    }, [username]);

    const userEvents = events.filter(event => event.user_id === user.id);

    return(
        <div className='ui stackable equal width grid'>
            <div className='column'>
                <img className='ui fluid circular image' alt='' src={user.profile_photo}/>
                <button className='ui button'>update profile photo</button>
            </div>
            <div className='column'>
                <h2>{user.username}</h2>
                <p>name: {user.name}</p>
                <p>bio:</p>
            </div>


            <div className='equal width row'>
                <h3>{currentUser.id === user.id ? 'my' : `${user.name}'s`} events</h3>
            </div>
            <div className='equal width row'>
                {userEvents.length > 0 ? (
                    userEvents.map(event => 
                        <div className='column' key={event.id}>
                            <h4>{event.title}</h4>
                            <Link to={`/events/${event.id}`}>
                                <button class='ui button'>view details</button>                
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