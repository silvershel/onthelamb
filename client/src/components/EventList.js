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
            <h2>events</h2>
            <select class="ui search dropdown" onChange={onFilterSelect}>
                <option value="all">all</option>
                <option value="mine">mine</option>
                <option value="attending">attending</option>
            </select>
            
            <div class="ui grid">
                <div class="ui stackable three column row">
                    
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <div class="column">
                            <div class="ui padded segment" key={event.id}>
                                <h4>{event.title}</h4>
                                    <p>starts: {event.start_date}</p>
                                    <p>ends: {event.start_date}</p>
                                    <h5>attendees</h5>
                                    <div class="ui equal width grid">
                                        {event.attendees && event.attendees.length > 0 ? (
                                            event.attendees.map((attendee) => (
                                                <div key={attendee.id}>
                                                    <img class="ui mini avatar image" alt="" src={attendee.user.profile_photo}/>
                                                    <span>{attendee.user.username}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p>no attendees yet.</p>
                                        )}
                                    </div>

                                <Link to={`/events/${event.id}`}>
                                    <button class="ui button">view details</button>                
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div class="column">
                        <p>no events found.</p>
                    </div>
                )}
            </div>
            </div>
        </div>
    )
}

export default EventList;