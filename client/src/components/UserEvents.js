import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import MiniCard from './MiniCard';

function UserEvents() {
    const { currentUser } = useAppContext();

    const userEvents = currentUser.events;
    
    return(
        <div className='ui stackable grid container'>
            
            <div className='ui row'>
            <h3>my events</h3>
            </div>

            <div className='ui four column row'>
                {userEvents.map((event) => (
                    <div className='ui column' key={event.id}>
                        <div className='ui card'>
                            <MiniCard event={event}/>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default UserEvents;