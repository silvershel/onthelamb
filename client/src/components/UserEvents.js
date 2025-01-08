import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MiniCard from './MiniCard';
import UserEvent from './UserEvent';

function UserEvents() {
    const { currentUser } = useAppContext();
    const [open, setOpen] = useState(null)
    const [isEditing, setIsEditing] = useState(false); 
    const [count, setCount] = useState(12);

    const toggleComponent = (event) => {
        setOpen(open === event.id ? null : event.id);
        setIsEditing(false);
    };

    const loadMoreEvents = () => {
        setCount((prevCount) => {
            const nextCount = prevCount + 4;
            return Math.min(nextCount, currentUser.events.length);
        });
    };
    
    return(
        <div>
            
            <div className='ui center aligned basic segment'>
                <h3>my events</h3>
            </div>

            {open && (
                <UserEvent 
                    event={currentUser.events.find(event => event.id === open)}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                />
            )}

            <div className='ui basic segment'>
                <div className='ui four stackable cards'>
                    {currentUser.events.slice(0, count).map((event) => (
                        <MiniCard event={event} key={event.id} toggleComponent={toggleComponent}/>
                    ))}
                </div>
            </div>

            <div className='ui basic segment'>
            {count < currentUser.events.length && (
                <div className='ui center aligned'>
                    <button className='ui button' onClick={loadMoreEvents}>
                        Load More
                    </button>
                </div>
            )}
            </div>

            <div className='ui center aligned basic segment'>
                <div className='ui grid'>
                    <div className='row'>
                        <div className='eight wide column'>
                            <div>
                                <h3>my ticketed events</h3>
                                {currentUser.tickets && currentUser.tickets.length > 0 ? (
                                    currentUser.tickets.map((ticket) => (
                                        <div key={ticket.id}>
                                            <p>{ticket.event.title}</p>
                                        </div>
                                    ))
                                    ) : (
                                    <p>No tickets available for this user.</p>
                                )}
                            </div>
                        </div>
                        <div className='eight wide column'>
                            <div>
                                <h3>my booths</h3>
                                {currentUser.booths && currentUser.booths.length > 0 ? (
                                    currentUser.booths.map((booth) => (
                                        <div key={booth.id}>
                                            <p>{booth.event.title}</p>
                                        </div>
                                ))
                                ) : (
                                    <p>No booths yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

        </div>
    )
}

export default UserEvents;