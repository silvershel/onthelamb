import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MiniCard from './MiniCard';
import UserEvent from './UserEvent';

function UserEvents() {
    const { currentUser } = useAppContext();
    const [open, setOpen] = useState(null)
    const [isEditing, setIsEditing] = useState(false); 
    const [count, setCount] = useState(4);

    const userEvents = currentUser.events;
    const userTickets = currentUser.tickets;
    const userBooths = currentUser.booths;

    const toggleComponent = (event) => {
        setOpen(open === event.id ? null : event.id);
        setIsEditing(false);
    };

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
                                {userTickets.map((ticket) => (
                                    <p key={ticket.id}>{ticket.id}</p>
                                ))}
                            </div>
                        </div>
                        <div className='eight wide column'>
                            <div>
                                <h3>my booths</h3>
                                {userBooths.map((booth) => (
                                    <p key={booth.id}>{booth.id}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

        </div>
    )
}

export default UserEvents;