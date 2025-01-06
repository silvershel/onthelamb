import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function CreateEvent({ resetComponent }) {
    const { currentUser, createEvent } = useAppContext();
    const navigate = useHistory()
    
    const formik = useFormik({
        initialValues: {
            event_type: '',
            title: '',
            start_date: '',
            end_date: '',
            creation_date: '',
            description: '',
            website_link: '',
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
            const newEvent = {
                event_type: values.event_type,
                title: values.title,
                start_date: values.start_date,
                end_date: values.end_date,
                creation_date: new Date(),
                description: values.description,
                website_link: values.website_link,
                user_id: currentUser.id,
                tickets: {},
                booths: {}
            }
            console.log(newEvent);
            createEvent(newEvent);
            resetComponent()
            navigate.push(`/dashboard`)
        }
    });

    return (
        <div>
            <div className='ui center aligned basic segment'>
                <h3>create event</h3>
            </div>

            <div className='ui basic segment'>           
            <form className='ui form error' onSubmit={formik.handleSubmit}>
                <div className='required field'>
                    <label>event type</label>
                    <select 
                        className='ui search dropdown' 
                        id='event_type' name='event_type' 
                        value={formik.values.event_type} 
                        onChange={formik.handleChange} >
                        
                        <option value='' disabled>select an option:</option>                        
                        {currentUser.user_type === 'sheep' ? (
                            <option value='local meetup'>local meetup</option>
                        ) : (
                            ['local meetup', 'festival', 'retreat', 'popup', 'trunk show',].map((eventType) => (
                            <option key={eventType} value={eventType}>{eventType}</option>
                            ))
                        )}
                    </select>
                    <div className='ui error message'>
                        {formik.errors.event_type && formik.touched.event_type && (
                            <p>{formik.errors.event_type}</p>
                        )}
                    </div>
                    
                </div>
                <div className='required field'>
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
                <div className='two fields'>
                <div className='required field'>
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
                <div className='required field'>
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
                </div>
                <div className='required field'>
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
                <div className='required field'>
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
                <div className='ui error message'>
                    {formik.errors.apiError 
                    ? (<div>{formik.errors.apiError}</div>)
                    : null}
                </div>
                <button className='ui button'type='submit'>save</button>
            </form>
            </div>

        </div>
    );
}

export default CreateEvent;