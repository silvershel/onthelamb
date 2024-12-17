import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function EventDetails({ currentUser, attendees, onAttend, onDeleteAttend }) {
    const [event, setEvent] = useState([]);
    const [user, setUser] = useState([]);
    const { eventId } = useParams();

    useEffect(() => {
        fetch(`/events/${eventId}`)
        .then((r) => r.json())
        .then((event) => {
            console.log(event);
            setEvent(event);
            setUser(event.user);
        })
        .catch((error) => console.error('Error fetching event:', error));
    }, [eventId, attendees])

    function userAttending() {
        return event.attendees && event.attendees.some(attendee => attendee.user_id === currentUser.id);
    }

    function onAttendClick() {
        const newAttendee = {
            comment: "hello from EventDetails",
            event_id: event.id,
            user_id: currentUser.id
        };
        console.log(newAttendee);
        onAttend(newAttendee);
    }

    function onDeleteAttendClick() {
        const attendeeToRemove = event.attendees.find(attendee => attendee.user_id === currentUser.id);
        if (attendeeToRemove) {
            onDeleteAttend(attendeeToRemove.id);
        }
    }

    function showAttendEventButton() {
        if (!userAttending()) {
            return (
                <button onClick={onAttendClick}>Attend</button>
            );
        } else {
            return (
                <button onClick={onDeleteAttendClick}>Remove Attendance</button>
            );
        }   
    }

    function showEditEventButton() {
        if (currentUser.id === event.user_id) {
            return <Link to={`/events/${event.id}/edit`}>
                <button>Edit Event</button>
            </Link>
        } else {
            return null
        }
    }

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
            {showAttendEventButton()}
            {showEditEventButton()}
            
            <h2>Attendees</h2>
            {showAttendeesList()}

            <h2>Vendors</h2>
            {showVendorsList()}
        </div>
    )
}

export default EventDetails;