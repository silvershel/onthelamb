import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";

function EventCreate() {
    const { currentUser, createEvent } = useAppContext();
    const navigate = useHistory()
    
    const formik = useFormik({
        initialValues: {
            event_type: "",
            title: "",
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
                attendees: {},
                vendors: {}
            }
            console.log(newEvent);
            createEvent(newEvent);

            navigate.push(`/users/${currentUser.username}`)
        }
    });

    return (
        <div>
            <h2>Create Event</h2>
            <form class="ui form error" onSubmit={formik.handleSubmit}>
                <div class="required field">
                    <label>Event Type</label>
                    <select class="ui search dropdown" id="event_type" name="event_type" value={formik.values.event_type} onChange={formik.handleChange} >
                        <option value="" disabled>Select an option:</option>

                        {currentUser.user_type === "Sheep" ? (
                            <option value="Local Meetup">Local Meetup</option>
                        ) : (
                            ["Local Meetup", "Festival", "Retreat", "Popup", "Trunk Show"].map((eventType) => (
                            <option key={eventType} value={eventType}>
                                {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
                            </option>
                            ))
                        )}

                    </select>
                    <div class="ui error message">
                        {formik.errors.event_type && formik.touched.event_type && (
                            <p>{formik.errors.event_type}</p>
                        )}
                    </div>
                    
                </div>
                <div class="required field">
                    <label>Event Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                    />
                    <div class="ui error message">
                        {formik.errors.title}  
                    </div>
                </div>
                <div class="two fields">
                <div class="required field">
                    <label>Start Date</label>
                    <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={formik.values.start_date}
                        onChange={formik.handleChange}
                    />
                     <div class="ui error message">
                        {formik.errors.start_date}
                    </div>
                </div>
                <div class="required field">
                    <label>End Date</label>
                    <input
                        type="date"
                        id="end_date"
                        name="end_date"
                        value={formik.values.end_date}
                        onChange={formik.handleChange}
                    />
                    <div class="ui error message">
                        {formik.errors.end_date}
                    </div>
                </div>
                </div>
                <div class="required field">
                    <label>Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                    <div class="ui error message">
                        {formik.errors.description}
                    </div>
                </div>
                <div class="required field">
                    <label>Event Website</label>
                    <input
                        type="text"
                        id="website_link"
                        name="website_link"
                        value={formik.values.website_link}
                        onChange={formik.handleChange}
                    />
                    <div class="ui error message">
                        {formik.errors.website_link}
                    </div>
                </div>
                <div class="ui error message">
                    {formik.errors.apiError 
                    ? (<div>{formik.errors.apiError}</div>)
                    : null}
                </div>
                <button class="ui button"type="submit">Save</button>
            </form>
        </div>
    );
}

export default EventCreate;