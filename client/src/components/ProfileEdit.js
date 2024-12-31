import React from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useFormik } from 'formik';
import * as Yup from "yup";

function ProfileEdit() {
    const { currentUser, updateUser } = useAppContext();
    const navigate = useHistory()

    const formik = useFormik({
        initialValues: {
            user_type: currentUser.user_type,
            name: currentUser.name,
        },

        validationSchema: Yup.object({
            user_type: Yup.string().required(),
            name: Yup.string().required("Name is required"),
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
            navigate.push(`/users/${updatedUser.username}`)
        },
    });

    return (
        <div>
            <h2>edit profile</h2>
            <form class="ui form" onSubmit={formik.handleSubmit}>
                <div class="field">
                    <label>User Type:</label>
                    <select 
                        class="ui search dropdown"
                        id="user_type" 
                        name="user_type" 
                        value={formik.values.user_type}
                        onChange={formik.handleChange} >
                        <option value="" disabled>please select a user type: </option>
                        <option value="Sheep">sheep</option>
                        <option value="Shepherd">shepherd</option>
                    </select>
                    <div class="ui error message">
                        {formik.errors.user_type}
                    </div>
                </div>
                <div class="field">
                    <label>name:</label>
                    <input 
                        type="text"
                        id="name"
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                    <div class="ui error message">
                        {formik.errors.name}
                    </div>
                </div>
                <div class="ui error message">
                    {formik.errors.apiError 
                    ? (<div>{formik.errors.apiError}</div>)
                    : null}
                </div>
                <button class="ui button" type="submit">save edits</button>
            </form>
        </div>
    )
}

export default ProfileEdit;