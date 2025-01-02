import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function EventCard({ event }) {
    const navigate = useHistory()

    return (
        <div className='ui card'>   
            <div className='content'>
                <img src='' />                
                <h5>{event.title}</h5>
                <p>{event.start_date} to {event.end_date}</p>
                <p>organized by: (username)</p>
                <p>{event.description}</p>
                <a href={event.website_link}>Website</a>
            </div> 
            <button className='ui bottom attached button' onClick={() => navigate.push(`/events/${event.id}`)}>view details</button>
        </div>
    )
}

export default EventCard;