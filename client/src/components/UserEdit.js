import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function UserEdit({ closeComponent }) {
    const { currentUser, updateUser } = useAppContext();

    const formik = useFormik({
        initialValues: {
            name: currentUser.name,
            user_type: currentUser.user_type,
        },

        validationSchema: Yup.object({
            user_type: Yup.string().required(),
            name: Yup.string().required('Name is required'),
        }),

        onSubmit: (values) => {
            const updatedUser = {
                    id: currentUser.id,
                    user_type: values.user_type,
                    name: values.name,
                    username: currentUser.username,
            }
            console.log(updatedUser);
            updateUser(updatedUser);
            closeComponent()
        },
    });

    return (
        <div className='ui center aligned basic segment'>
            
            <form className='ui form' onSubmit={formik.handleSubmit}>
                <div className='inline field'>
                    <label>name:</label>
                    <input 
                        type='text'
                        id='name'
                        name='name'
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                    <div className='ui error message'>
                        {formik.errors.name}
                    </div>
                </div>
                <div className='inline field'>
                    <label>user type:</label>
                    <select 
                        className='ui search dropdown'
                        id='user_type' 
                        name='user_type' 
                        value={formik.values.user_type}
                        onChange={formik.handleChange} >
                        <option value='' disabled>please select a user type: </option>
                        <option value='Sheep'>sheep</option>
                        <option value='Shepherd'>shepherd</option>
                    </select>
                    <div className='ui error message'>
                        {formik.errors.user_type}
                    </div>
                </div>
                <div className='ui error message'>
                    {formik.errors.apiError 
                    ? (<div>{formik.errors.apiError}</div>)
                    : null}
                </div>
                <button className='ui button' type='submit'>save edits</button>
            </form>

        </div>
    )
}

export default UserEdit;