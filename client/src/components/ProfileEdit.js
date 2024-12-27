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
            <h1>Edit Profile</h1>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label>User Type:</label>
                    <select 
                        id="user_type" 
                        name="user_type" 
                        value={formik.values.user_type}
                        onChange={formik.handleChange} >
                        <option value="" disabled>Please select a user type: </option>
                        <option value="Sheep">Sheep</option>
                        <option value="Shepherd">Shepherd</option>
                    </select>
                    <p>{formik.errors.user_type}</p>
                </div>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text"
                        id="name"
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                    <p>{formik.errors.first_name}</p>
                </div>
                <div>
                    {formik.errors.apiError ? (
                        <div>{formik.errors.apiError}</div>
                    ) : null}
                </div>
                <button type="submit">Save Edits</button>
            </form>
        </div>
    )
}

export default ProfileEdit;