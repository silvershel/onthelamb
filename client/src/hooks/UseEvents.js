import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useAttendees } from '../hooks/UseAttendees';

export const useEvents = () => {
    const { setEvents } = useContext(AppContext);
    const { createAttendee } = useAttendees();

    const createEvent = (newEvent) => {
        fetch('/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
        })
        .then((r) => r.json())
        .then((newEvent) => {
            console.log(newEvent);
            setEvents((prevEvents) => [...prevEvents, newEvent]);

            const newAttendee = {
            comment: 'hello',
            user_id: newEvent.user_id,
            event_id: newEvent.id,
            };
            console.log(newAttendee);
            createAttendee(newAttendee);
        })
        .catch((error) => {
            console.error('Error creating new event:', error);
        });
    };

    const updateEvent = (eventId, updatedEvent) => {
        fetch(`/events/${eventId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
        })
        .then((r) => r.json())
        .then((updatedEvent) => {
            setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
            );
        })
        .catch((error) => {
            console.error('Error updating event:', error);
        });
    };

    const deleteEvent = (eventId) => {
        fetch(`/events/${eventId}`, {
        method: 'DELETE',
        })
        .then((r) => {
            if (r.ok) {
            console.log('Event deleted.');
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
            } else {
            console.error('Unable to delete event.');
            }
        })
        .catch((error) => {
            console.error('Error deleting event:', error);
        });
    };

    return { createEvent, updateEvent, deleteEvent };
};