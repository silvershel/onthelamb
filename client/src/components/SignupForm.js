import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useFormik } from 'formik';
import * as Yup from "yup";

function SignupForm({ style }) {
    const { setCurrentUser } = useAppContext();
    
    const formik = useFormik({
        initialValues: {
            name: "",
            username: "",
            password: "",
        },

        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            username: Yup.string().required("Username is required"),
            password: Yup.string().required("Password is required"),
        }),

        onSubmit: (values) => {
            fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: values.name,
                    username: values.username,
                    password: values.password,
                }),
            })
                .then((user) => setCurrentUser(user))
                .catch((error) => console.error('Signup form error:', error));
        },
    });

    return (
        <div style={style}>
            <h1>Sign Up</h1>
            <form onSubmit={formik.handleSubmit}>
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