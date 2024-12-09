import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";

function AttendForm({ user, onAttend }) {
    const { eventId } = useParams()
    const history = useHistory()

    const formik = useFormik({
        initialValues: {
            comment: "",
        },

        validationSchema: Yup.object({
            comment: Yup.string().required("Please add a comment."),
        }),

        onSubmit: (values) => {
            const newAttendee = {
                comment: values.comment,
                event_id: eventId,
                user_id: user.id
            };
            console.log(newAttendee);
            onAttend(newAttendee);
            history.push(`/events/${eventId}`)
        }
    });

    return (
        <div>
            <h1>Attend Event</h1>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label>Comment:</label>
                    <input 
                        type="text"
                        id="comment"
                        name="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                    />
                    <p>{formik.errors.comment}</p>
                </div>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default AttendForm;