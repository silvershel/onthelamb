import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

function EventEdit({ onUpdateEvent, onDeleteEvent }) {
    const { eventId } = useParams()
    const [event, setEvent] = useState([])
    const [type, setType] = useState(event.event_type)
    const [title, setTitle] = useState(event.title);
    const [startDate, setStartDate] = useState(event.start_date);
    const [endDate, setEndDate] = useState(event.end_date);
    const [description, setDescription] = useState(event.description);
    const [websiteLink, setWebsiteLink] = useState(event.website_link);
    const navigate = useHistory()

    useEffect(() => {
        fetch(`/events/${eventId}`)
        .then((r) => r.json())
        .then((event) => {
            console.log(event);
            setEvent(event);
            setType(event.event_type)
            setTitle(event.title)
            setStartDate(event.start_date)
            setEndDate(event.end_date)
            setDescription(event.description)
            setWebsiteLink(event.website_link)
        })
        .catch((error) => console.error('Error fetching event:', error));
    }, [eventId])

    function handleSubmit(e) {
        e.preventDefault();
        const updatedEvent = {
            event_type: type,
            title: title,
            start_date: startDate,
            end_date: endDate,
            description: description,
            website_link: websiteLink,
        };
        console.log(updatedEvent);
        onUpdateEvent(event.id, updatedEvent)
        navigate.push(`/events/${event.id}`);
    }

    function handleDelete() {
        onDeleteEvent(event.id);
        navigate.push("/");
    }

    return (
        <div>
            <h2>Edit {event.title}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Event Type</label>
                    <select 
                        id="event_type" 
                        name="event_type" 
                        value={type} 
                        onChange={(e) => setType(e.target.value)} >
                        <option value="local meetup">Local Meetup</option>
                        <option value="festival">Festival</option>
                        <option value="retreat">Retreat</option>
                        <option value="popup">Popup</option>
                        <option value="trunk show">Trunk Show</option>
                    </select>
                </div>
                <div>
                    <label>Event Title</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label>End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Event Website</label>
                    <input
                        type="text"
                        name="websiteLink"
                        value={websiteLink}
                        onChange={(e) => setWebsiteLink(e.target.value)}
                    />
                </div>
                <button type="submit">Save Edits</button>
                <button onClick={handleDelete} type="submit">Delete Event</button>
            </form>
        </div>
    );
}

export default EventEdit;