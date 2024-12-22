import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useFormik } from 'formik';
import * as Yup from "yup";

function SignupForm({ style }) {
    const { signup } = useAppContext();
    
    const formik = useFormik({
        initialValues: {
            user_type: "",
            name: "",
            username: "",
            password: "",
        },

        validationSchema: Yup.object({
            user_type: Yup.string().required(),
            name: Yup.string().required("Name is required"),
            username: Yup.string().required("Username is required"),
            password: Yup.string().required("Password is required"),
        }),

        onSubmit: (values) => {
            const newUser = {
                    user_type: values.user_type,
                    name: values.name,
                    username: values.username,
                    password: values.password,
            }
            console.log(newUser);
            signup(newUser);
        },
    });

    return (
        <div style={style}>
            <h1>Sign Up</h1>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label>User Type:</label>
                    <select 
                        id="user_type" 
                        name="user_type" 
                        value={formik.values.user_type}
                        onChange={formik.handleChange} >
                        <option value="" disabled>Please select a user type: </option>
                        <option value="sheep">Sheep</option>
                        <option value="shepherd">Shepherd</option>
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
                        value={formik.values.first_name}
                    />
                    <p>{formik.errors.first_name}</p>
                </div>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text"
                        id="username"
                        name="username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                    />
                    <p>{formik.errors.username}</p>
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="text" 
                        id="password"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    <p>{formik.errors.password}</p>
                </div>
                <div>
                    {formik.errors.apiError ? (
                        <div>{formik.errors.apiError}</div>
                    ) : null}
                </div>
                <button type="submit">Sign Up</button>
                <p>Already have an account? <Link to="/login">Log In</Link></p>
            </form>
        </div>
    )
}

export default SignupForm;