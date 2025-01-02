import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

function EventDetails() {
    const { currentUser, fetchEvent, event, createTicket, deleteTicket } = useAppContext();
    const { eventId } = useParams();


    useEffect(() => {
        fetchEvent(eventId);
        console.log(event)
    }, [eventId]);

    function onAttendClick() {
        const newTicket = {
            comment: 'hello from EventDetails',
            event_id: event.id,
            user_id: currentUser.id
        };
        console.log(newTicket);
        createTicket(newTicket, eventId);
    }

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
                <div className='ui column'>
				<h2>{event.title}</h2>
                </div>
			</div> 

            <div className='ui basic segment'>
                <div className='ui column'>
                    <h3>details</h3>
                    <p>organized by: <Link to={`/users/${event.user?.username}`}>{event.username}</Link></p>
                    <p>starts: {event.start_date}</p>
                    <p>ends: {event.end_date}</p>
                    <p>website: {event.website_link}</p>
                    <a href={event.website_link}>{event.website_link}</a>
                </div>
            </div>

            <div className='ui basic segment'>
                <div className='ui column'>
                    <h3>tickets</h3>
                    {/* {event.tickets.map((ticket) => (
                        <div className='ui card' key={ticket.id}>
                            <p>hi</p>
                        </div>
                    ))} */}
                </div>
            </div>

            <div className='ui basic segment'> 
                <div className='ui column'>            
                    <h3>booths</h3>
                    {/* {event.booths && event.booths.length > 0 ? (
                        event.booths.map((booth) => (
                            <div className='ui card' key={booth.id}>
                            <p>{booth.user.username}</p>
                            </div>
                        ))onClick={() => openComponent('profile edit')
                    ) : (
                        <p>no booths have been assigned yet.</p>
                    )} */}
                </div>
            </div>
                           
            <div className='column'>
                <div>
                    {event.user_id !== currentUser.id && (
                        !userAttending() ? (
                            <button className='positive ui button' onClick={onAttendClick}>attend</button>
                        ) : (
                            <button className='negative ui button' onClick={onDeleteAttendClick}>remove attendance</button>
                        )
                    )}
                </div>
            </div>

            
            <div className='equal width row'>            
                
            </div>
            
        </div>
    )
}

export default EventDetails;