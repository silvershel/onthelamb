import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import UserEventDetails from './UserEventDetails';
import UserEventEdit from './UserEventEdit';
import AddVendorForm from './AddVendorForm';

function UserEvent({ event, isEditing, setIsEditing }) {
    const { deleteBooth } = useAppContext();
    const [isEditingVendor, setIsEditingVendor] = useState(false);

    if (!event) {
        return <div className='ui very padded basic center aligned segment'>
            <h4>Event not found</h4>
        </div>;
    }

    return (
        <div className='ui basic segment'>

            <div className='ui stackable grid'>
                    
                <div className='row'>
                    <div className='sixteen wide column'>
                        <h2>{event.title}</h2>
                    </div>
                </div>

                <div className='row'>
                    <div className='eight wide column'>
                        {!isEditing 
                        ? <UserEventDetails event={event} setIsEditing={setIsEditing}/>
                        : <UserEventEdit event={event} setIsEditing={setIsEditing}/>
                        }
                    </div>

                    <div className='four wide column'>
                    <h3>attendees</h3>
                        {event.tickets && event.tickets.length > 0 ? (
                            event.tickets.map((ticket) => (
                                <div key={ticket.id} className='ui comments'>
                                    <div className='comment'>
                                        <a className='ui avatar image'>
                                            <img src={ticket.user.profile_photo}/>
                                        </a>
                                        <div className='content'>
                                            <a className='author'>{ticket.user.name}</a>
                                            <div className='text'>
                                                {ticket.comment}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='ui divider'></div>
                                </div>
                            ))
                        ) : (
                            <p>No attendees yet</p>
                        )}
                    </div>

                    <div className='four wide column'>
                    <h3>vendors</h3>
                        {event.booths && event.booths.length > 0 ? (
                            event.booths.map((booth) => (
                                <div key={booth.id}>
                                    <button class="circular mini ui icon button" onClick={() => deleteBooth(booth, booth.event_id)}>
                                        <i class="icon close"></i>
                                    </button>
                                    <span>{booth.user.name}</span>
                                </div>
                            ))
                        ) : (
                            <p>No booths yet</p>
                        )}
                        {!isEditingVendor 
                        ? <button className='ui button' onClick={() => setIsEditingVendor(prevState => !prevState)}>add a vendor</button>
                        : <AddVendorForm event={event} setIsEditingVendor={setIsEditingVendor}/>
                        }
                        
                    </div>
                </div>

            </div>     

        </div>
    )
}

export default UserEvent;