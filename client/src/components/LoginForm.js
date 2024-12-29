import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { button } from "semantic-ui-react"

function LoginForm() {
    const { login } = useAppContext();
    
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },

        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            password: Yup.string().required("Password is required"),
        }),

        onSubmit: (values) => {
            const user = {
                username: values.username,
                password: values.password,
            }
            // console.log(user);
            login(user);            
        },
    });

    return (
        <div>
            <h1 class="ui header">Log In</h1>
            <form class="ui form" onSubmit={formik.handleSubmit}>
                <div class="field">
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
                <div class="field">
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
                <button class="ui basic button" type="submit">Log In</button>
            </form>
            <p>Don't have an account? <Link to="/signup">Signup</Link></p>
        </div>
    )
}

export default LoginForm;