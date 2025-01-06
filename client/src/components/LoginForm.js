import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';


function LoginForm() {
    const { login } = useAppContext();

    const checkUsername = (username) => {
        formik.setFieldError('username', '');
        formik.setStatus({usernameAvailable: ''});

        fetch(`/check_username/${username}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) {
                    formik.setStatus({ usernameAvailable: 'username checks out.' });
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
            password: '',
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
            password: Yup.string().required('Password is required'),
        }),

        onSubmit: (values) => {
            const user = {
                username: values.username,
                password: values.password,
            }
            login(user);            
        },
    });

    return (
        <div className='ui basic center aligned segment'>
            <h1>on the lamb</h1>
            <h3>login</h3>
            <p>Yarn’t you glad you found us?</p>
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
                <div className='field'>
                    <input 
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Password'
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    <div className='ui error message'>
                        {formik.errors.password && formik.touched.password && (
                            <p>{formik.errors.password}</p>
                        )}
                    </div>
                </div>
                <div className='ui error message'>
                    {formik.errors.apiError 
                    ? (<div>{formik.errors.apiError}</div>)
                    : null}
                </div>
                <button className='ui button' type='submit' disabled={!formik.isValid || formik.isSubmitting}>log in</button>
                <p>don't have an account? <Link to='/signup'>signup.</Link></p>
            </form>
        </div>
    )
}

export default LoginForm;