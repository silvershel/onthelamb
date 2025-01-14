import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function EventCard({ event }) {
    const navigate = useHistory()

    return (
        <div className='ui card'>   
            <div className='content'>
                <img className='ui image' alt='' src={event.event_hero}/>
                <h4>{event.title}</h4>
                <p>{event.start_date} to {event.end_date}</p>
                <p>organized by: {event.user.username}</p>
                <p>{event.description}</p>
            </div> 
            <button className='ui bottom attached button' onClick={() => navigate.push(`/events/${event.id}`)}>view details</button>
        </div>
    )
}

export default EventCard;