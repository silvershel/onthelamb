import React from 'react';
import { useAppContext } from '../contexts/AppContext';

function MiniCard({ event }) {
    const { deleteEvent } = useAppContext();
     

    return (
        <div key={event.id} className='ui card'>  
            <div className='content'>

            <div class="blurring dimmable image">
                <div class="ui inverted dimmer">
                    <div class="content">
                    <div class="center">
                        <div class="ui primary button">view details</div>
                    </div>
                    </div>
                </div>
                    <img src="/images/avatar/large/jenny.jpg"/>
                </div>
                <div class="content">
                    <h5>{event.title}</h5>
                <div class="meta">
                    <p>{event.start_date}</p>
                </div>
            </div>
            </div>

            <div class="extra content">
                <button class="ui icon button" onClick={() => deleteEvent(event.id)}>
                <i class="trash alternate icon"></i>
                </button>
                {/* <a>
                    <i class="trash alternate icon"></i>
                </a> */}
                <a>
                    <i class="right floated folder open icon"></i>
                </a>
            </div>
        </div>
    )
}

export default MiniCard;