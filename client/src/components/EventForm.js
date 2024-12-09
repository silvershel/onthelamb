import React from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";

function EventForm({ user, onAttend, onCreateEvent }) {
    const history = useHistory()
    
    const formik = useFormik({
        initialValues: {
            name: "",
            start_date: "",
            end_date: "",
            website_link: "",
            // attending: false,
            // comment: "",
        },

        validationSchema: Yup.object({
            name: Yup.string().required("Event name is required"),
            start_date: Yup.string().required("Start date is required"),
            end_date: Yup.string().required("End date is required"),
            website_link: Yup.string().required("Event website is required."),
            // attending: Yup.boolean().optional(),
            // comment: Yup.string().required("Please leave a comment.")
        }),

        onSubmit: (values) => {
            const newEvent = {
                name: values.name,
                start_date: values.start_date,
                end_date: values.end_date,
                website_link: values.website_link,
                user_id: user.id,
            };
            console.log(newEvent)
            onCreateEvent(newEvent);

            // const newAttendee = {
            //     comment: values.comment,
            //     user_id: values.user_id,
            //     event_id: newEvent.id,
            // }
            // console.log(newAttendee)
            // onAttend(newAttendee)

            history.push('/profile')
        }
    });

    return (
        <div>
            <h2>Create Event</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label>Event Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                    <p>{formik.errors.name}</p>
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
                {/* <div>
                    <label>Attending?</label>
                    <input
                        type="checkbox"
                        id="attending"
                        name="attending"
                        checked={formik.values.attending}
                        onChange={formik.handleChange}
                    />
                    <p>{formik.errors.attending}</p>
                </div>
                <div>
                    <label>Comment</label>
                    <textarea
                        id="comment"
                        name="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <p>{formik.errors.comment}</p>
                </div> */}
                {formik.errors.apiError ? (
                        <div>{formik.errors.apiError}</div>
                    ) : null}
                <button type="submit">Save</button>
            </form>
        </div>
    );
}

export default EventForm;