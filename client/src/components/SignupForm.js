import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";

function SignupForm({ style, onSignup }) {
    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            username: "",
            password: "",
        },

        validationSchema: Yup.object({
            first_name: Yup.string().required("First name is required"),
            last_name: Yup.string().required("Last name is required"),
            username: Yup.string().required("Username is required"),
            password: Yup.string().required("Password is required"),
        }),

        onSubmit: (values, { setSubmitting, setErrors }) => {
            fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: values.first_name,
                    last_name: values.last_name,
                    username: values.username,
                    password: values.password,
                }),
            })
                .then((r) => {
                    setSubmitting(false);
                    if (r.ok) {
                        r.json().then((user) => onSignup(user));
                    } else {
                        r.json().then((err) => setErrors({ apiError: err.errors }));
                    }
                })
                .catch(() => {
                    setSubmitting(false);
                    setErrors({ apiError: "Something went wrong. Please try again later." });
                });
        },
    });

    return (
        <div style={style}>
            <h1>Sign Up</h1>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input 
                        type="text"
                        id="first_name"
                        name="first_name"
                        onChange={formik.handleChange}
                        value={formik.values.first_name}
                    />
                    <p>{formik.errors.first_name}</p>
                </div>
                <div>
                    <label>Last Name:</label>
                    <input 
                        type="text"
                        id="last_name"
                        name="last_name"
                        onChange={formik.handleChange}
                        value={formik.values.last_name}
                    />
                    <p>{formik.errors.last_name}</p>
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
                <button>Sign Up</button>
                <p>Already have an account? <Link to="/login">Log In</Link></p>
            </form>
        </div>
    )
}

export default SignupForm;