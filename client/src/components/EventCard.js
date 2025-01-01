import React from "react";

function EventCard({ event }) {

    return (
        <div>    
            <image src=""></image>                
            <h5>{event.title}</h5>
            <p>{event.start_date}</p>
        </div>
    )
}

export default EventCard;