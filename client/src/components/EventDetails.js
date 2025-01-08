import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import AttendForm from './AttendForm';

function EventDetails() {
    const { currentUser, fetchEvent, event, deleteTicket } = useAppContext();
    const [isEditing, setIsEditing] = useState(false); 
    const { eventId } = useParams();

    useEffect(() => {
        fetchEvent(eventId);
        console.log(event)
    }, [eventId]);

    function onDeleteAttendClick() {
        const ticketToDelete = event.tickets.find(ticket => ticket.user_id === currentUser.id);
        deleteTicket(ticketToDelete, eventId);
    }

    const userAttending = () => {
        return event.tickets && event.tickets.some((ticket) => ticket.user_id === currentUser.id);
    }

    return (
        <div className='ui basic segment'>
            <div className='ui basic segment'>

                <div className='ui basic center aligned segment'>
                    <div className='ui column'>
                        <h3>event details</h3>
                    </div>
                </div>

                <div className='ui stackable grid'>
                        
                    <div className='row'>
                        <div className='sixteen wide column'>
                            <h2>{event.title}</h2>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='eight wide column'>
                            <h3>details</h3>
                            <p>organized by: <Link to={`/users/${event.user?.username}`}>{event.username}</Link></p>
                            <p>starts: {event.start_date}</p>
                            <p>ends: {event.end_date}</p>
                            <a href={event.website_link}>{event.website_link}</a>
                            <div style={{ marginTop: '30px' }}>
                                {event.user_id !== currentUser.id && (
                                    !userAttending() ? (
                                        !isEditing ? (
                                            <button className='ui button' onClick={() => setIsEditing(prevState => !prevState)}>attend</button>
                                        ) : (
                                            <AttendForm event={event} setIsEditing={setIsEditing}/>
                                        )
                                    ) : (
                                        <button className='ui button' onClick={onDeleteAttendClick}>remove attendance</button>
                                    )
                                )}
                            </div>
                        </div>

                        <div className='four wide column'>
                        <h3>attendees</h3>
                        {event.tickets && event.tickets.length > 0 ? (
                            event.tickets.map((ticket) => (
                                <div key={ticket.id} className='ui comments'>
                                    <div className='comment'>
                                        <a class='ui avatar image'>
                                            <img src={ticket.user.profile_photo}/>
                                        </a>
                                        <div class="content">
                                            <a class="author">{ticket.user.name}</a>
                                            <div class="text">
                                                {ticket.comment}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='ui divider'></div>
                                </div>
                            ))
                        ) : (
                            <p>No attendees yet</p>
                        )}
                        </div>

                        <div className='four wide column'>
                        <h3>vendors</h3>
                        {event.booths && event.booths.length > 0 ? (
                            event.booths.map((booth) => (
                                <div key={booth.id}>
                                    <span>{booth.user.name}</span>
                                </div>
                            ))
                        ) : (
                            <p>No vendors yet</p>
                        )}
                        </div>
                    </div>
        
                </div>  

            </div>
        </div>
    )
}

export default EventDetails;