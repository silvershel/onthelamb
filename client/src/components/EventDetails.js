import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

function EventDetails() {
    const { currentUser, fetchEvent, event, createAttendee, deleteAttendee } = useAppContext();
    const { eventId } = useParams();

    useEffect(() => {
        fetchEvent(eventId);
    }, [eventId]);

    function onAttendClick() {
        const newAttendee = {
            comment: "hello from EventDetails",
            event_id: event.id,
            user_id: currentUser.id
        };
        console.log(newAttendee);
        createAttendee(newAttendee, eventId);
    }

    function onDeleteAttendClick() {
        const attendeeToDelete = event.attendees.find(attendee => attendee.user_id === currentUser.id);
        deleteAttendee(attendeeToDelete, eventId);
    }

    const userAttending = () => {
        return event.attendees && event.attendees.some((attendee) => attendee.user_id === currentUser.id);
    }

    return (
        <div class="ui equal width grid">
            <div class="column">
                <img class="ui fluid image" alt="" src="https://modernfarmer.com/wp-content/uploads/2017/12/Funny-Sheep-Facts-jpg.webp"/>
                
            </div>
            <div class="column">
                <h1>{event.title}</h1>
                <p>Organized by: <Link to={`/users/${event.user?.username}`}>{event.user?.username}</Link></p>
                <p>Starts: {event.start_date}</p>
                <p>Ends: {event.end_date}</p>
                <p>Website: {event.website_link}</p>
                <a href={event.website_link}>{event.website_link}</a>
                <div>
                    {event.user_id !== currentUser.id && (
                        !userAttending() ? (
                            <button class="positive ui button" onClick={onAttendClick}>Attend</button>
                        ) : (
                            <button class="negative ui button" onClick={onDeleteAttendClick}>Remove Attendance</button>
                        )
                    )}
                </div>

                <div>
                    {currentUser.id === event.user_id ? (
                        <Link to={`/events/${event.id}/edit`}>
                            <button class="ui button">Manage Event</button>
                        </Link>
                    ) : (
                        null
                    )}
                </div>
            </div>

            
            <div class="equal width row">            
                <div class="column">
                    <h2>Attendees</h2>
                    {event.attendees && event.attendees.length > 0 ? (
                        event.attendees.map((attendee) => (
                            <div class="column" key={attendee.id}>
                                <img class="ui avatar image" alt="" src={attendee.user.profile_photo}/>
                                <span>{attendee.user.username}</span>
                            </div>
                        ))
                    ) : (
                        <p>No one attending yet.</p>
                    )}
                </div>
                
                <div class="column">            
                    <h2>Vendors</h2>
                    {event.vendors && event.vendors.length > 0 ? (
                        event.vendors.map((vendor) => (
                            <div class="column" key={vendor.id}>
                            <p>{vendor.user.username}</p>
                            </div>
                        ))
                    ) : (
                        <p>No vendors have been assigned.</p>
                    )}
                </div>
            </div>
            
        </div>
    )
}

export default EventDetails;