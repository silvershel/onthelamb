import React from "react";
import { Link } from "react-router-dom";

function EventPreview({ event }) {

    return (
        <div>
            <h2>{event.name}</h2>
            <p>{event.start_date} – {event.end_date}</p>
            <Link to={`/events/${event.id}`}>
                <button>View Details</button>
            </Link>
        </div>
    );
}

export default EventPreview;