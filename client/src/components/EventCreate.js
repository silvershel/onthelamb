import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { useEvents } from '../hooks/UseEvents';
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";

function EventCreate() {
    const { createEvent } = useEvents();
    const { currentUser } = useAppContext();
    const navigate = useHistory()
    
    const formik = useFormik({
        initialValues: {
            event_type: "",
            title: "",
            // address: "", use google api to convert to latitude and longitude.
            start_date: "",
            end_date: "",
            description: "",
            website_link: "",
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
            const newEvent = {
                event_type: values.event_type,
                title: values.title,
                start_date: values.start_date,
                end_date: values.end_date,
                description: values.description,
                website_link: values.website_link,
                user_id: currentUser.id,
            };
            console.log(newEvent)
            createEvent(newEvent);

            navigate.push(`/users/${currentUser.username}`)
        }
    });

    return (
        <div>
            <h2>Create Event</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label>Event Type</label>
                    <select id="event_type" name="event_type" value={formik.values.event_type} onChange={formik.handleChange} >
                        <option value="" disabled>Select an option:</option>
                        <option value="local meetup">Local Meetup</option>
                        <option value="festival">Festival</option>
                        <option value="retreat">Retreat</option>
                        <option value="popup">Popup</option>
                        <option value="trunk show">Trunk Show</option>
                    </select>
                    {formik.errors.event_type && formik.touched.event_type && (
                        <p>{formik.errors.event_type}</p>
                    )}
                </div>
                <div>
                    <label>Event Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                    />
                    <p>{formik.errors.title}</p>
                </div>
                <div>
                    <label>Start Date</label>
                    <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={formik.values.start_date}
                        onChange={formik.handleChange}
                    />
                    <p>{formik.errors.start_date}</p>
                </div>
                <div>
                    <label>End Date</label>
                    <input
                        type="date"
                        id="end_date"
                        name="end_date"
                        value={formik.values.end_date}
                        onChange={formik.handleChange}
                    />
                    <p>{formik.errors.end_date}</p>
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="description"
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                    <p>{formik.errors.description}</p>
                </div>
                <div>
                    <label>Event Website</label>
                    <input
                        type="text"
                        id="website_link"
                        name="website_link"
                        value={formik.values.website_link}
                        onChange={formik.handleChange}
                    />
                    <p>{formik.errors.website_link}</p>
                </div>
                {formik.errors.apiError ? (
                        <div>{formik.errors.apiError}</div>
                    ) : null}
                <button type="submit">Save</button>
            </form>
        </div>
    );
}

export default EventCreate;