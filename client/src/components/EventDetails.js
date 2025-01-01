import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

function EventDetails({ closeComponent }) {
    const { currentUser, fetchEvent, event, createAttendee, deleteAttendee } = useAppContext();
    const { eventId } = useParams();


    useEffect(() => {
        fetchEvent(eventId);
        console.log(event)
    }, [eventId]);

    function onAttendClick() {
        const newAttendee = {
            comment: 'hello from EventDetails',
            event_id: event.id,
            user_id: currentUser.id
        };
        console.log(newAttendee);
        createAttendee(newAttendee, eventId);
    }

    function onDeleteAttendClick() {
        const attendeeToDelete = event.attendees.find(attendee => attendee.user_id === currentUser.id);
        deleteAttendee(attendeeToDelete, eventId);
    }

    const userAttending = () => {
        return event.attendees && event.attendees.some((attendee) => attendee.user_id === currentUser.id);
    }

    return (
        <div className='ui stackable equal width grid'>

            <button onClick={()=>closeComponent()} className='ui button'>Close Component</button>


            <div className='column'>
                <img className='ui fluid image' alt='' src='https://modernfarmer.com/wp-content/uploads/2017/12/Funny-Sheep-Facts-jpg.webp'/>
                
            </div>
            <div className='column'>
                <h2>{event.title}</h2>
                {/* <p>organized by: <Link to={`/users/${event.user?.username}`}>{event.username}</Link></p> */}
                <p>starts: {event.start_date}</p>
                <p>ends: {event.end_date}</p>
                <p>website: {event.website_link}</p>
                <a href={event.website_link}>{event.website_link}</a>
                <div>
                    {event.user_id !== currentUser.id && (
                        !userAttending() ? (
                            <button className='positive ui button' onClick={onAttendClick}>attend</button>
                        ) : (
                            <button className='negative ui button' onClick={onDeleteAttendClick}>remove attendance</button>
                        )
                    )}
                </div>

                <div>
                </div>
            </div>

            
            <div className='equal width row'>            
                <div className='column'>
                    <h3>attendees</h3>
                    {/* {event.attendees.map((attendee) => (
                        <div className='ui card' key={attendee.id}>
                            <p>hi</p>
                        </div>
                    ))} */}
                </div>
                
                <div className='column'>            
                    <h3>vendors</h3>
                    {/* {event.vendors && event.vendors.length > 0 ? (
                        event.vendors.map((vendor) => (
                            <div className='ui card' key={vendor.id}>
                            <p>{vendor.user.username}</p>
                            </div>
                        ))onClick={() => openComponent('profile edit')
                    ) : (
                        <p>no vendors have been assigned yet.</p>
                    )} */}
                </div>
            </div>
            
        </div>
    )
}

export default EventDetails;