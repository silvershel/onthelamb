import React, { useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import EventPreview from "./EventPreview";

function EventList() {
    const { filteredEvents, filter, setFilter } = useAppContext();

    useEffect(() => {
        setFilter("all");
    }, []);

    const onFilterSelect = (e) => {
        // console.log(filter) RETURNING UNDEFINED
        // console.log(e.target.value)
        setFilter(e.target.value);
    };


    return (
        <div>
            <h1>Events</h1>
            <select onChange={onFilterSelect} value={filter}>
                <option value="all">All Events</option>
                <option value="my events">My Events</option>
                <option value="attending">Attending</option>
            </select>
            
            {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                    <EventPreview key={event.id} event={event}/>
                ))
            ) : (
                <p>No events found.</p>
            )}
        </div>
    )
}

export default EventList;