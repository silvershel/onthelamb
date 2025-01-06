import React from 'react';
import UserEventDetails from './UserEventDetails';
import UserEventEdit from './UserEventEdit';

function UserEvent({ event, isEditing, setIsEditing }) {

    return (
        <div className='ui basic segment'>

            <div>
                <div className='ui stackable grid'>
                    
                    <div className='row'>
                        <div className='sixteen wide column'>
                            <h2>{event.title}</h2>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='eight wide column'>
                            {!isEditing 
                            ? <UserEventDetails event={event} isEditing={isEditing} setIsEditing={setIsEditing}/>
                            : <UserEventEdit event={event} isEditing={isEditing} setIsEditing={setIsEditing}/>
                            }
                        </div>

                        <div className='four wide column'>
                        <h3>attendees</h3>
                        <p>attendee list here</p>
                        </div>

                        <div className='four wide column'>
                        <h3>vendors</h3>
                        <p>vendor list here</p>
                        </div>
                    </div>

                </div>
            </div>           
            
        </div>
    )
}

export default UserEvent;