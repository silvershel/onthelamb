import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

function EventPreview({ event }) {
    const { currentUser, fetchEvent, createAttendee, deleteAttendee } = useAppContext();

    // useEffect(() => {
    //     fetchEvent(event.id);
    // }, [event.id]);

    // const userAttending = () => {
    //     return event.attendees && event.attendees.some((attendee) => attendee.user_id === currentUser.id);
    // }

    // function onAttendClick() {
    //     const newAttendee = {
    //         comment: "hello from EventDetails",
    //         event_id: event.id,
    //         user_id: currentUser.id
    //     };
    //     console.log(newAttendee);
    //     createAttendee(newAttendee);
    //     fetchEvent(event.id);
    // }

    // function onDeleteAttendClick() {
    //     const attendee = event.attendees.find(attendee => attendee.user_id === currentUser.id);
    //     deleteAttendee(attendee.id);
    //     fetchEvent(event.id);
    // }

    return (
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
{/* 
            <div>
                {event.user_id !== currentUser.id && (
                    !userAttending() ? (
                        <button onClick={onAttendClick}>Attend</button>
                    ) : (
                        <button onClick={onDeleteAttendClick}>Remove Attendance</button>
                    )
                )}
            </div> */}
            
        </div>
    );
}

export default EventPreview;