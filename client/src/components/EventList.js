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
            <h2>Events</h2>
            <select class="ui search dropdown" onChange={onFilterSelect}>
                <option value="all">All Events</option>
                <option value="my events">My Events</option>
                <option value="attending">Attending</option>
            </select>
            
            <div class="ui grid">
                <div class="ui stackable three column row">
                    
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <div class="column">
                            <div class="ui padded segment" key={event.id}>
                                <h3>{event.title}</h3>
                                    <p>{event.start_date} to {event.end_date}</p>
                                    
                                    <h4>Attendees</h4>
                                    <div class="ui equal width grid">
                                        {event.attendees && event.attendees.length > 0 ? (
                                            event.attendees.map((attendee) => (
                                                <div key={attendee.id}>
                                                    <img class="ui mini avatar image" alt="" src={attendee.user.profile_photo}/>
                                                    <span>{attendee.user.username}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No one attending yet.</p>
                                        )}
                                    </div>

                                <Link to={`/events/${event.id}`}>
                                    <button class="ui button">View Details</button>                
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div class="column">
                        <p>No events found.</p>
                    </div>
                )}
            </div>
            </div>
        </div>
    )
}

export default EventList;