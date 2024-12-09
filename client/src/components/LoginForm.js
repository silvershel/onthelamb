import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";

function LoginForm({ style, onLogin }) {
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },

        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            password: Yup.string().required("Password is required"),
        }),

        onSubmit: (values, { setSubmitting, setErrors }) => {
            fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                }),
            })
                .then((r) => {
                    setSubmitting(false);
                    if (r.ok) {
                        r.json().then((user) => onLogin(user));
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
            <h1>Log In</h1>
            <form onSubmit={formik.handleSubmit}>
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
                <button type="submit">Log In</button>
            </form>
            <p>Don't have an account? <Link to="/signup">Signup</Link></p>
        </div>
    )
}

export default LoginForm;