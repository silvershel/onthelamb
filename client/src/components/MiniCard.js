import React from 'react';
import { useAppContext } from '../contexts/AppContext';

function MiniCard({ event, toggleComponent }) {
    const { deleteEvent } = useAppContext();     

    return (
        <div key={event.id} className='ui card'>  
            <div className='content'>
                <img className='ui image' alt='' src='http://localhost:5555/static/assets/default-event-header.jpg'/>
                <h4>{event.title}</h4>
                <p>{event.start_date}</p>
                
            </div>

            <div className='extra content'>
                <button className='ui icon button' onClick={() => deleteEvent(event.id)}>
                <i className='trash alternate icon'></i>
                </button>
                <button className='ui right floated icon button' onClick={() => toggleComponent(event)}>
                <i className='open folder icon'></i>
                </button>
            </div>
        </div>
    )
}

export default MiniCard;