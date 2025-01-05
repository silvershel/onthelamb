import React from 'react';
import { useAppContext } from '../contexts/AppContext';

function MiniCard({ event, toggleComponent }) {
    const { deleteEvent } = useAppContext();     

    return (
        <div key={event.id} className='ui card'>  
            <div className='content'>

            <div className='blurring dimmable image'>
                <div className='ui inverted dimmer'>
                    <div className='content'>
                    <div className='center'>
                        <div className='ui primary button'>view details</div>
                    </div>
                    </div>
                </div>
                    <img alt='' src='/images/avatar/large/jenny.jpg'/>
                </div>
                <div className='content'>
                    <h4>{event.title}</h4>
                <div className='meta'>
                    <p>{event.start_date}</p>
                </div>
            </div>
            </div>

            <div className='extra content'>
                <button className='ui icon button' onClick={() => deleteEvent(event.id)}>
                <i className='trash alternate icon'></i>
                </button>
                <button className='ui right floated icon button' onClick={() => toggleComponent(event)}>
                <i className='open folder icon'></i>
                </button>
            </div>
        </div>
    )
}

export default MiniCard;