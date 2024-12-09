import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function EventDetails({ user, attendees }) {
    const [event, setEvent] = useState([])
    const { eventId } = useParams()

    const eventAttendees = attendees.filter(attendee => attendee.event_id === event.id)

    useEffect(() => {
        fetch(`/events/${eventId}`)
        .then((r) => r.json())
        .then((event) => {
            console.log(event);
            setEvent(event);
        })
        .catch((error) => console.error('Error fetching event:', error));
    }, [])

    return (
        <div>
            <h2>{event.name}</h2>
            <p>Organized by:</p>
            <p>Starts: {event.start_date}</p>
            <p>Ends: {event.end_date}</p>
            <p >Website: {event.website_link}</p>
            <Link to={`/events/${event.id}/attend`}>
                <button>Attend Event</button>
            </Link>
            {user.id === event.user_id ? (
                <Link to={`/events/${event.id}/edit`}>
                    <button>Edit Event</button>
                </Link>
            ) : (
                null
            )
            }
            <h2>Attendees</h2>
            {eventAttendees.length > 0 ? (
                eventAttendees.map((attendee) => (
                    <div>
                        <p>{attendee.comment}</p>
                    </div>
                ))
            ) : (
                <>
                <p>No One Attending Yet</p>
                </>
            )}
        </div>
    )
}

export default EventDetails;