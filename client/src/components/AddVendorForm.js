import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';


function AddVendorForm({ event, setIsEditingVendor }) {
    const { fetchUser, user, createBooth } = useAppContext();

    const checkUsername = (username) => {
        formik.setFieldError('username', '');
        formik.setStatus({usernameAvailable: ''});

        fetch(`/check_username/${username}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) {
                    formik.setStatus({ usernameAvailable: 'username checks out.' });
                    fetchUser(username)
                        .then(() => {
                            console.log("User fetched:", user);
                        })
                } else {
                    formik.setFieldError('username', 'username not found.');
                }
            })
            .catch((error) => {
                console.error('Username check error:', error.message);
            });
    };
    
    const formik = useFormik({
        initialValues: {
            username: '',
        },

        validationSchema: Yup.object({
            username: Yup.string()
                .required('Username is required')
                .test('check-username', 'Checking username...', function(value) {
                    if (value) {
                        checkUsername(value);
                    }
                    return true;
                }),
        }),

        onSubmit: () => {
            const newBooth = {
                user_id: user.id,
                event_id: event.id
            }
            createBooth(newBooth, event.id); 
            setIsEditingVendor()           
        },
    });

    return (
        <div style={{ marginTop: '20px' }}>
            <form className='ui form error success' onSubmit={formik.handleSubmit}>
                <div className='field'>
                    <input 
                        type='text'
                        id='username'
                        name='username'
                        placeholder='Username'
                        onChange={formik.handleChange}
                        value={formik.values.username}
                    />
                    <div>
                        {!formik.errors.username && formik.status
                            ? <div className='ui success message'>{formik.status.usernameAvailable}</div> 
                            : <div className='ui error message'>{formik.errors.username}</div>
                        }
                    </div>
                </div>
                <div className='ui error message'>
                    {formik.errors.apiError 
                    ? (<div>{formik.errors.apiError}</div>)
                    : null}
                </div>
                <button className='ui button' type='submit' disabled={!formik.isValid || formik.isSubmitting}>add vendor</button>
            </form>
        </div>
    )
}

export default AddVendorForm;