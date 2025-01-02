import React from 'react';

function UserEventDetails({ event, isEditing, setIsEditing}) {

    return (
        <div>
            <div className='ui basic segment'>
                <h2>{event.title}</h2>
                <h3>details</h3>
                <p>starts: {event.start_date}</p>
                <p>ends: {event.end_date}</p>
                <p>website: {event.website_link}</p>
                <a href={event.website_link}>{event.website_link}</a>
            </div>
            <div className='ui basic segment'>
                <button 
                className='ui button' 
                onClick={() => setIsEditing(prevState => !prevState)}>
                edit
                </button>

            
            </div>
        </div> 
    )
}

export default UserEventDetails;