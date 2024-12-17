import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export const useAttendees = () => {
    const { setAttendees } = useContext(AppContext);

    function createAttendee(newAttendee) {
        fetch('/attendees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAttendee),
        })
        .then((r) => r.json())
        .then((newAttendee) => {
            setAttendees((prevAttendees) => [...prevAttendees, newAttendee]);
        })
        .catch((error) => {
            console.error('Error creating new attendee:', error);
        });
    };

    function deleteAttendee(attendeeId) {
        fetch(`/attendees/${attendeeId}`, {
            method: 'DELETE',
        })
        .then(r => {
            if (r.ok) {
                console.log("Attendee deleted.")
                setAttendees((prevAttendees) => prevAttendees.filter(attendee => attendee.id !== attendeeId));
            } else {
                console.error("Unable to delete attendee.");
            }
        })
        .catch(error => {
            console.error("Error deleting attendee:", error);
        });
    }

    return { createAttendee, deleteAttendee };
}