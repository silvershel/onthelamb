import React from "react";
import EventPreview from "./EventPreview";

function EventList({ currentUser, events }) {
    // const [nearbyEvents, setNearbyEvents] = useState([])

    // const myEvents === events.map((event) => {
    //    if (currentUser.id === event.user.user_id) (
    //      return <EventPreview key={event.id} event={event}/>
    //    )}

    function onFilterSelect(e) {
        const selection = e.target.value;

        if (selection === "my events") {
            // return my events;
        } else if (selection === "distance") {
            // return by distance;
        } else {
            // return all events;
        }
    }

    function showEventList() {
        if (events.length > 0) {
            return events.map((event) => (
                <EventPreview key={event.id} event={event}/>
            ));
          } else {
            return <p>No Events Found.</p>;
          }
    }

    return (
        <div>
            <h1>All Events</h1>
            <p>Filter by: All | Attending | Near Me</p>
            {showEventList()}
        </div>
    )
}

export default EventList;