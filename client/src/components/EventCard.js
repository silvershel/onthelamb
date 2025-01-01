import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function EventCard({ event }) {
    const navigate = useHistory()

    return (
        <div>    
            <img src=''></img>                
            <h5>{event.title}</h5>
            <p>{event.start_date}</p>
            <button className='ui button' onClick={() => navigate.push(`/events/${event.id}`)}>view details</button>
        </div>
    )
}

export default EventCard;