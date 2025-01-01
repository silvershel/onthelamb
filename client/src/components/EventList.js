import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import EventCard from './EventCard';

function EventList() {
    const { events } = useAppContext();

    const renderCards = (events, attribute) => {
        const sortedEvents = [...events].sort((a, b) => new Date(a[attribute]) - new Date(b[attribute]));
        return sortedEvents.slice(0, 4).map((event) => (
            <div className='ui column' key={event.id}>
                <div className='ui card'>
                    <EventCard event={event} />
                </div>
            </div>
        ));
    };

    return (
        <div className='ui stackable grid container'>

            <div className='ui center aligned row'>
                <div className='ui column'>
                    <h2>events</h2>
                    <h4>cute subtitle banner goes here</h4>
                </div>
            </div>             

            
            <div className='ui row'>
                <div className='ui column'>
                    <h3>happening soon</h3>
                </div>
            </div> 
            <div className='ui four column row'>
                {renderCards(events, 'start_date')}
            </div>

            <div className='ui row'>
                <div className='ui column'>
                    <h3>new</h3>
                </div>
            </div> 
            <div className='ui four column row'>
                {renderCards(events, 'creation_date')}
            </div>


            {/* <h3>nearby</h3> */}
            {/* {nearbyEvents} */}
        </div>
    )
}

export default EventList;