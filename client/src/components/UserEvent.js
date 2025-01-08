import React from 'react';
import UserEventDetails from './UserEventDetails';
import UserEventEdit from './UserEventEdit';

function UserEvent({ event, isEditing, setIsEditing }) {
    const testEvent = {
        title: 'Music Festival',
        tickets: [
          { id: 1 },
          { id: 2 },
          { id: 3 }
        ],
      };

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
                        ? <UserEventDetails event={event} isEditing={isEditing} setIsEditing={setIsEditing}/>
                        : <UserEventEdit event={event} isEditing={isEditing} setIsEditing={setIsEditing}/>
                        }
                    </div>

                    <div className='four wide column'>
                    <h3>attendees</h3>
                        {event.tickets && event.tickets.length > 0 ? (
                            event.tickets.map((ticket) => (
                                <div key={ticket.id} className='ui comments'>
                                    <div className='comment'>
                                        <a class='ui avatar image'>
                                            <img src={ticket.user.profile_photo}/>
                                        </a>
                                        <div class="content">
                                            <a class="author">{ticket.user.name}</a>
                                            <div class="text">
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
                                    <span>{booth.user.name}</span>
                                </div>
                            ))
                        ) : (
                            <p>No booths yet</p>
                        )}
                    </div>
                </div>

            </div>     

        </div>
    )
}

export default UserEvent;