import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function SignupForm() {
    const { signup } = useAppContext();


    const checkUsername = (username) => {
        formik.setFieldError('username', '');
        formik.setStatus({usernameAvailable: ''});

        fetch(`/check_username/${username}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) {
                    formik.setFieldError('username', data.error);
                } else {
                    formik.setStatus({ usernameAvailable: data.message });
                }
            })
            .catch((error) => {
                console.error('Username check error:', error.message);
            });
    };

    
    const formik = useFormik({
        initialValues: {
            user_type: '',
            name: '',
            username: '',
            password: '',
        },

        validationSchema: Yup.object({
            user_type: Yup.string().required(),
            name: Yup.string().required('Name is required'),
            username: Yup.string()
                .required('Username is required')
                .matches(/^[\w]+$/, 'Username can only contain letters, numbers, and underscores.')
                .min(5, 'Username must be at least 5 characters.')
                .test('check-username', 'Checking username...', function(value) {
                    if (value) {
                        checkUsername(value);
                    }
                    return true;
                }),
            password: Yup.string().required('Password is required'),
        }),

        onSubmit: (values) => {
            const newUser = {
                user_type: values.user_type,
                name: values.name,
                username: values.username,
                password: values.password,
            }
            console.log(newUser);
            signup(newUser)
        },
    });


    return (
        <div className='ui basic center aligned segment'>
            <h1>on the lamb</h1>
            <h3>signup</h3>
            <p>Wool you join the fun?</p>
            <form className='ui form error success' onSubmit={formik.handleSubmit}>
                <div className='required field'>
                    <select 
                        id='user_type' 
                        name='user_type' 
                        value={formik.values.user_type}
                        onChange={formik.handleChange} >
                        <option value='' disabled>Please select a user type: </option>
                        <option value='sheep'>sheep (standard user)</option>
                        <option value='shepherd'>shepherd (business or organizer)</option>
                    </select>
                    <div className='ui error message'>
                        {formik.errors.user_type}
                    </div>
                </div>
                <div className='required field'>
                    <input 
                        type='text'
                        id='name'
                        name='name'
                        placeholder='Name'
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                     <div className='ui error message'>
                        {formik.errors.name}
                    </div>
                </div>
                <div className='required field'>
                    <input 
                        type='text'
                        id='username'
                        name='username'
                        placeholder='Username (this cannot be changed)'
                        onChange={(e) => {
                            formik.handleChange(e);
                            checkUsername(e.target.value, formik.setFieldError);
                        }}
                        value={formik.values.username}
                    />
                    <div>
                        {!formik.errors.username && formik.status
                            ? <div className='ui success message'>{formik.status.usernameAvailable}</div> 
                            : <div className='ui error message'>{formik.errors.username}</div>
                        }
                    </div>
                </div>
                <div className='required field'>
                    <input 
                        type='password' 
                        id='password'
                        name='password'
                        placeholder='Password'
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                     <div className='ui error message'>
                        {formik.errors.password}
                    </div>
                </div>
                <div className='ui error message'>
                    {formik.errors.apiError 
                    ? (<div>{formik.errors.apiError}</div>)
                    : null}
                </div>
                <button className='ui button' type='submit'>sign up</button>
                <p>already have an account? <Link to='/login'>log in.</Link></p>
            </form>
        </div>
    )
}

export default SignupForm;