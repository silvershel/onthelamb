import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

function EventList() {
    const { filteredEvents, setFilter } = useAppContext();

    useEffect(() => {
        setFilter("all");
    }, []);

    const onFilterSelect = (e) => {
        console.log(e.target.value)
        setFilter(e.target.value);
    };

    return (
        <div>
            <h1>Events</h1>
            <select onChange={onFilterSelect}>
                <option value="all">All Events</option>
                <option value="my events">My Events</option>
                <option value="attending">Attending</option>
            </select>
            
            {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                    <div>
                        <h1>{event.title}</h1>
                            <p>{event.start_date} to {event.end_date}</p>
                            <h2>Attendees</h2>
                            {event.attendees && event.attendees.length > 0 ? (
                                event.attendees.map((attendee) => (
                                    <div key={attendee.id}>
                                    <p>{attendee.user.username}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No one attending yet.</p>
                            )}

                        <Link to={`/events/${event.id}`}>
                            <button>View Details</button>                
                        </Link>

                    </div>
                ))
            ) : (
                <p>No events found.</p>
            )}
        </div>
    )
}

export default EventList;