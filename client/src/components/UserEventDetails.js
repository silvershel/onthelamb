import React from 'react';

function UserEventDetails({ event, setIsEditing}) {

    return (
        <div>

            <div>
                <h3>details</h3>
                <p>starts: {event.start_date}</p>
                <p>ends: {event.end_date}</p>
                <a href={event.website_link}>{event.website_link}</a>
            </div>

            <div>
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