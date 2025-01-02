import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MiniCard from './MiniCard';
import UserEvent from './UserEvent';

function UserEvents() {
    const { currentUser } = useAppContext();
    const [open, setOpen] = useState(null)
    const [isEditing, setIsEditing] = useState(false); 
    const [count, setCount] = useState(4);

    const toggleComponent = (event) => {
        setOpen(open === event.id ? null : event.id);
        setIsEditing(false);
    };

    const userEvents = currentUser.events;

    const loadMoreEvents = () => {
        setCount((prevCount) => {
            const nextCount = prevCount + 4;
            return Math.min(nextCount, userEvents.length);
        });
    };
    
    return(
        <div>
            
            <div className='ui center aligned basic segment'>
                <h3>my events</h3>
            </div>

            {open && (
                <UserEvent 
                    event={userEvents.find(event => event.id === open)}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                />
            )}

            <div className='ui basic segment'>
                <div className='ui four stackable cards'>
                    {userEvents.slice(0, count).map((event) => (
                        <MiniCard event={event} key={event.id} toggleComponent={toggleComponent}/>
                    ))}
                </div>
            </div>

            <div className='ui basic segment'>
            {count < userEvents.length && (
                <div className="ui center aligned">
                    <button className="ui button" onClick={loadMoreEvents}>
                        Load More
                    </button>
                </div>
            )}
            </div>

        </div>
    )
}

export default UserEvents;