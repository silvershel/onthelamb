import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useFormik } from 'formik';
import * as Yup from "yup";

function EventEdit() {
    const { currentUser, event, fetchEvent, updateEvent, deleteEvent } = useAppContext();
    const { eventId } = useParams()
    const navigate = useHistory()

    useEffect(() => {
        fetchEvent(eventId)
    }, [eventId])

    const formik = useFormik({
        initialValues: {
            event_type: event.event_type,
            title: event.title,
            start_date: event.start_date,
            end_date: event.end_date,
            description: event.description,
            website_link: event.website_link,
        },

        validationSchema: Yup.object({
            event_type: Yup.string().required("Please select an event type."),
            title: Yup.string().required("Event title is required."),
            start_date: Yup.string().required("Start date is required."),
            end_date: Yup.string().required("End date is required."),
            description: Yup.string().required("Please include a description."), 
            website_link: Yup.string().required("Please include a website link."),
        }),

        onSubmit: (values) => {
            const updatedEvent = {
                event_type: values.event_type,
                title: values.title,
                start_date: values.start_date,
                end_date: values.end_date,
                description: values.description,
                website_link: values.website_link,
                user_id: currentUser.id,
            };
            updateEvent(event.id, updatedEvent);
            navigate.push(`/events/${eventId}`)
        }
    });

    function handleDelete() {
        deleteEvent(eventId);
        navigate.push("/");
    }

    return (
        <div>
            <h2>edit {event.title}</h2>
            <h3>event details</h3>
            <form class="ui form error" onSubmit={formik.handleSubmit}>
                <div class="field">
                    <label>type</label>
                    <select class="ui search dropdown" id="event_type" name="event_type" value={formik.values.event_type} onChange={formik.handleChange} >
                        <option value="" disabled>please select an option:</option>

                        {currentUser.user_type === "Sheep" ? (
                            <option value="Local Meetup">local meetup</option>
                        ) : (
                            ["Local Meetup", "Festival", "Retreat", "Popup", "Trunk Show"].map((eventType) => (
                            <option key={eventType} value={eventType}>
                                {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
                            </option>
                            ))
                        )}
                    </select>
                    <div class="ui error message">
                        {formik.errors.event_type}
                    </div>
                </div>
                <div class="field">
                    <label>title</label>
                    <input
                        type="text"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                    />
                    <div class="ui error message">
                        {formik.errors.title}
                    </div>
                </div>
                <div class="field">
                    <label>starts</label>
                    <input
                        type="date"
                        name="start_date"
                        value={formik.values.start_date}
                        onChange={formik.handleChange}
                    />
                    <div class="ui error message">
                        {formik.errors.start_date}
                    </div>
                </div>
                <div class="field">
                    <label>ends</label>
                    <input
                        type="date"
                        name="end_date"
                        value={formik.values.end_date}
                        onChange={formik.handleChange}
                    />
                    <div class="ui error message">
                        {formik.errors.end_date}
                    </div>
                </div>
                <div class="field">
                    <label>description</label>
                    <input
                        type="text"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                    <div class="ui error message">
                        {formik.errors.description}
                    </div>
                </div>
                <div class="field">
                    <label>website</label>
                    <input
                        type="text"
                        name="website_link"
                        value={formik.values.website_link}
                        onChange={formik.handleChange}
                    />
                    <div class="ui error message">
                        {formik.errors.website_link}
                    </div>
                </div>
                <div>
                    <h3>vendors</h3>
                    {event.vendors && event.vendors.length > 0 ? (
                        event.vendors.map((vendor) => (
                            <div key={vendor.id}>
                            <p>{vendor.user.username}</p>
                            <p>(remove)</p>
                            </div>
                        ))
                    ) : (
                        <p>no vendors have been assigned.</p>
                    )}
                    <button class="ui button" type="button">add vendor</button>
                </div>
                <button class="ui button" type="submit">save edits</button>
            </form>
            <button class="ui button" type="button" onClick={handleDelete}>delete event</button>
        </div>
    );
}

export default EventEdit;