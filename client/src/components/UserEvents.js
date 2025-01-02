import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MiniCard from './MiniCard';

function UserEvents() {
    const { currentUser } = useAppContext();
    const [count, setCount] = useState(4);

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

            <div className='ui basic segment'>
                <div className='ui four stackable cards'>
                    {userEvents.slice(0, count).map((event) => (
                        <MiniCard event={event} key={event.id}/>
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