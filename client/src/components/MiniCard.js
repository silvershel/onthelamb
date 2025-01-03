import React from 'react';
import { useAppContext } from '../contexts/AppContext';

function MiniCard({ event, toggleComponent }) {
    const { deleteEvent } = useAppContext();     

    return (
        <div key={event.id} className='ui card'>  
            <div className='content'>

            <div class='blurring dimmable image'>
                <div class='ui inverted dimmer'>
                    <div class='content'>
                    <div class='center'>
                        <div class='ui primary button'>view details</div>
                    </div>
                    </div>
                </div>
                    <img src='/images/avatar/large/jenny.jpg'/>
                </div>
                <div class='content'>
                    <h4>{event.title}</h4>
                <div class='meta'>
                    <p>{event.start_date}</p>
                </div>
            </div>
            </div>

            <div class='extra content'>
                <button class='ui icon button' onClick={() => deleteEvent(event.id)}>
                <i class='trash alternate icon'></i>
                </button>
                <button class='ui right floated icon button' onClick={() => toggleComponent(event)}>
                <i class='open folder icon'></i>
                </button>
            </div>
        </div>
    )
}

export default MiniCard;