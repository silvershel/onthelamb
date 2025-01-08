import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function AttendForm({ event, setIsEditing }) {
    const { currentUser, createTicket } = useAppContext();

    const formik = useFormik({
        initialValues: {
            comment: ''
        },

        validationSchema: Yup.object({
            comment: Yup.string().required('Please leave a comment.')
        }),

        onSubmit: (values) => {
            const newTicket = {
                    user_id: currentUser.id,
                    event_id: event.id,
                    comment: values.comment
            }
            console.log(newTicket);
            createTicket(newTicket, event.id);
            setIsEditing()
        },
    });

    return (
        <div style={{ marginTop: '20px' }}>
            <h4>leave a comment to attend.</h4>
            <form className='ui form error' onSubmit={formik.handleSubmit}>
                <div className='inline field'>
                    <label>comment:</label>
                    <input 
                        type='text'
                        id='comment'
                        name='comment'
                        onChange={formik.handleChange}
                        value={formik.values.comment}
                    />
                    <div className='ui error message'>
                        {formik.errors.comment && formik.touched.comment && (
                            <p>{formik.errors.comment}</p>
                        )}
                    </div>
                </div>
                <div className='ui error message'>
                    {formik.errors.apiError 
                    ? (<div>{formik.errors.apiError}</div>)
                    : null}
                </div>
                <button className='ui button' type='submit'>attend</button>
            </form>

        </div>
    )
}

export default AttendForm;