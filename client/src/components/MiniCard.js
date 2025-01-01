import React from "react";

function MiniCard({ event, openComponent }) {

    return (
        <div key={event.id}>      
            <h5>{event.title}</h5>
            <p>{event.start_date}</p>
            <button className="ui button" onClick={() => openComponent(`${event.id}`)}>Manage Event</button>
        </div>
    )
}

export default MiniCard;