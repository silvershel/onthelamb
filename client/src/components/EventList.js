import React, { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import EventPreview from "./EventPreview";

function EventList() {
    const { currentUser, events } = useAppContext();
    const [filter, setFilter] = useState("all");
    const [filteredEvents, setFilteredEvents] = useState(events);

    useEffect(() => {
        FilterEvents(filter);
    }, [events, filter]);

    function FilterEvents(selection) {
        let eventsList = [];

        if (selection === "my events") {
            eventsList = events.filter(event => event.user_id === currentUser.id);
        } else if (selection === "attending") {
            eventsList = events.filter(event => 
                event.attendees.filter(attendee => attendee.user.id === currentUser.id).length > 0
              );
        } else {
            eventsList = events
        }
        setFilteredEvents(eventsList);
    }

    function onFilterSelect(e) {
        setFilter(e.target.value);
    }

    function showEventList() {
        if (filteredEvents.length > 0) {
            return filteredEvents.map((event) => (
                <EventPreview key={event.id} event={event}/>
            ));
          } else {
            return <p>No Events Found.</p>;
          }
    }

    return (
        <div>
            <h1>Events</h1>
            <select onChange={onFilterSelect} value={filter}>
                <option value="all">All Events</option>
                <option value="my events">My Events</option>
                <option value="attending">Attending</option>
                {/* <option value="near me">Near Me</option> */}
            </select>
            
            {showEventList()}
        </div>
    )
}

export default EventList;