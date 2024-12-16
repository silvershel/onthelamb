import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function EventDetails({ currentUser }) {
    const [event, setEvent] = useState([])
    const [user, setUser] = useState([])
    const { eventId } = useParams()

    useEffect(() => {
        fetch(`/events/${eventId}`)
        .then((r) => r.json())
        .then((event) => {
            console.log(event);
            setEvent(event);
            setUser(event.user)
        })
        .catch((error) => console.error('Error fetching event:', error));
    }, [eventId])

    function showEditEventButton() {
        if (currentUser.id === event.user_id) {
            return <Link to={`/events/${event.username}/edit`}>
                <button>Edit Event</button>
            </Link>
        } else {
            return null
        }
    }

    // function showAttendEventButton(){
    //     if (currentUser.id === event.attendees.user.id) (null) : (button)
    // }

    function showAttendeesList() {
        if (event.attendees && event.attendees.length > 0) {
            return event.attendees.map((attendee) => (
              <div key={attendee.id}>
                <p>{attendee.user.username}</p>
              </div>
            ));
          } else {
            return <p>No one attending yet.</p>;
          }
    }

    function showVendorsList() {
        if (event.vendors && event.vendors.length > 0) {
            return event.vendors.map((vendor) => (
              <div key={vendor.id}>
                <p>{vendor.user.username}</p>
              </div>
            ));
          } else {
            return <p>No vendors have been assigned.</p>;
          }
    }


    return (
        <div>
            <h2>{event.title}</h2>
            <Link to={`/users/${user.username}`}>
                <p>Organized by: {user.username}</p>
            </Link>
            <p>Starts: {event.start_date}</p>
            <p>Ends: {event.end_date}</p>
            <p >Website: {event.website_link}</p>
            <Link to={`/events/${event.id}/attend`}>
                <button>Attend Event</button>
            </Link>
            {showEditEventButton()}
            
            <h2>Attendees</h2>
            {showAttendeesList()}

            <h2>Vendors</h2>
            {showVendorsList()}
        </div>
    )
}

export default EventDetails;