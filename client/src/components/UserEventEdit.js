import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function UserEventEdit({ event, isEditing, setIsEditing }) {
    const { currentUser, updateEvent } = useAppContext();


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
            event_type: Yup.string().required('Please select an event type.'),
            title: Yup.string().required('Event title is required.'),
            start_date: Yup.string().required('Start date is required.'),
            end_date: Yup.string().required('End date is required.'),
            description: Yup.string().required('Please include a description.'), 
            website_link: Yup.string().required('Please include a website link.'),
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
            setIsEditing()
            // navigate.push(`/events/${event.id}`)
        }
    });

    return (
        <div>
            <form className='ui form error' onSubmit={formik.handleSubmit}>
                <div className='field'>
                    <label>type</label>
                    <select className='ui search dropdown' id='event_type' name='event_type' value={formik.values.event_type} onChange={formik.handleChange} >
                        <option value='' disabled>please select an option:</option>

                        {currentUser.user_type === 'sheep' ? (
                            <option value='Local Meetup'>local meetup</option>
                        ) : (
                            ['Local Meetup', 'Festival', 'Retreat', 'Popup', 'Trunk Show'].map((eventType) => (
                            <option key={eventType} value={eventType}>
                                {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
                            </option>
                            ))
                        )}
                    </select>
                    <div className='ui error message'>
                        {formik.errors.event_type && formik.touched.event_type && (
                            <p>{formik.errors.event_type}</p>
                        )}
                    </div>
                </div>
                <div className='field'>
                    <label>title</label>
                    <input
                        type='text'
                        id='title'
                        name='title'
                        value={formik.values.title}
                        onChange={formik.handleChange}
                    />
                    <div className='ui error message'>
                        {formik.errors.title && formik.touched.title && (
                            <p>{formik.errors.title}</p>
                        )}
                    </div>
                </div>
                <div className='field'>
                    <label>starts</label>
                    <input
                        type='date'
                        id='start_date'
                        name='start_date'
                        value={formik.values.start_date}
                        onChange={formik.handleChange}
                    />
                    <div className='ui error message'>
                        {formik.errors.start_date && formik.touched.start_date && (
                            <p>{formik.errors.start_date}</p>
                        )}
                    </div>
                </div>
                <div className='field'>
                    <label>ends</label>
                    <input
                        type='date'
                        id='end_date'
                        name='end_date'
                        value={formik.values.end_date}
                        onChange={formik.handleChange}
                    />
                    <div className='ui error message'>
                        {formik.errors.end_date && formik.touched.end_date && (
                            <p>{formik.errors.end_date}</p>
                        )}
                    </div>
                </div>
                <div className='field'>
                    <label>description</label>
                    <input
                        type='text'
                        id='description'
                        name='description'
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                    <div className='ui error message'>
                        {formik.errors.description && formik.touched.description && (
                            <p>{formik.errors.description}</p>
                        )}
                    </div>
                </div>
                <div className='field'>
                    <label>website</label>
                    <input
                        type='text'
                        id='website_link'
                        name='website_link'
                        value={formik.values.website_link}
                        onChange={formik.handleChange}
                    />
                    <div className='ui error message'>
                        {formik.errors.website_link && formik.touched.website_link && (
                            <p>{formik.errors.website_link}</p>
                        )}
                    </div>
                </div>
                <button className='ui button' type='submit' >save edits</button>
                <button className='ui button' type='click' onClick={()=>setIsEditing()}>close window</button>
            </form>
        </div>
    );
}

export default UserEventEdit;