import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import EventCard from './EventCard';

function EventList() {
    const { events } = useAppContext();

    const renderCards = (events, attribute) => {
        const sortedEvents = [...events].sort((a, b) => new Date(a[attribute]) - new Date(b[attribute]));
        return sortedEvents.slice(0, 4).map((event) => (
            <EventCard event={event} key={event.id} />
        ));
    };

    return (
        <div className='ui basic segment'>

            <div className='ui basic segment'>
                <div className='ui column'>
                    <h2>events</h2>
                    <p>What's happening in the community.</p>
                </div>
            </div>             

            {/* happening soon */}
            <div className='ui basic segment'>
                <div className='ui column'>
                    <h3>happening soon</h3>
                </div>
            </div> 
            
            <div className='ui basic segment'>
                <div className='ui four stackable cards'>
                    {renderCards(events, 'start_date')}
                </div>
            </div>

            {/* new events */}
            <div className='ui basic segment'>
                <div className='ui column'>
                    <h3>new</h3>
                </div>
            </div> 
            <div className='ui basic segment'>
                <div className='ui four stackable cards'>
                    {renderCards(events, 'creation_date')}
                </div>
            </div>

            {/* STRETCH: nearby events */}
            
        </div>
    )
}

export default EventList;