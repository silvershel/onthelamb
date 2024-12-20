import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

function EventDetails() {
    const { currentUser, fetchEvent, event, createAttendee, deleteAttendee } = useAppContext();
    const { eventId } = useParams();

    useEffect(() => {
        fetchEvent(eventId);
    }, [eventId]);

    const userAttending = () => {
        return event.attendees && event.attendees.some((attendee) => attendee.user_id === currentUser.id);
    }

    function onAttendClick() {
        const newAttendee = {
            comment: "hello from EventDetails",
            event_id: event.id,
            user_id: currentUser.id
        };
        console.log(newAttendee);
        createAttendee(newAttendee);
        fetchEvent(eventId);
    }

    function onDeleteAttendClick() {
        const attendee = event.attendees.find(attendee => attendee.user_id === currentUser.id);
        deleteAttendee(attendee.id);
        fetchEvent(eventId);
    }


    return (
        <div>
            <h2>{event.title}</h2>
            <p>Organized by: <Link to={`/users/${event.user?.username}`}>{event.user?.username}</Link></p>
            <p>Starts: {event.start_date}</p>
            <p>Ends: {event.end_date}</p>
            <p>Website: {event.website_link}</p>
            <a href={event.website_link}>{event.website_link}</a>
            
            <div>
                {!userAttending() ? (
                    <button onClick={onAttendClick}>Attend</button>
                ) : (
                    <button onClick={onDeleteAttendClick}>Remove Attendance</button>
                )}
            </div>

            <div>
                {currentUser.id === event.user_id ? (
                    <Link to={`/events/${event.id}/edit`}>
                        <button>Edit Event</button>
                    </Link>
                ) : (
                    null
                )}
            </div>
            
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

            <h2>Vendors</h2>
            {event.vendors && event.vendors.length > 0 ? (
                event.vendors.map((vendor) => (
                    <div key={vendor.id}>
                      <p>{vendor.user.username}</p>
                    </div>
                  ))
            ) : (
                <p>No vendors have been assigned.</p>
            )}
        </div>
    )
}

export default EventDetails;