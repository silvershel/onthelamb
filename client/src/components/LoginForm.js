import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useFormik } from 'formik';
import * as Yup from "yup";


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
            login(user);            
        },
    });

    return (
        <div class="ui very padded center aligned container">
            <h1>Log In</h1>
            <form class="ui form error" onSubmit={formik.handleSubmit}>
                <div class="field">
                    <input 
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                    />
                    <div class="ui error message">
                        {formik.errors.username}
                    </div>
                </div>
                <div class="field">
                    <input 
                        type="text"
                        id="password"
                        name="password"
                        placeholder="Password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    <div class="ui error message">
                        {formik.errors.password}
                    </div>
                </div>
                <div class="ui error message">
                    {formik.errors.apiError 
                    ? (<div>{formik.errors.apiError}</div>)
                    : null}
                </div>
                <button class="ui button" type="submit">Log In</button>
                <p>Don't have an account? <Link to="/signup">Signup</Link></p>
            </form>
        </div>
    )
}

export default LoginForm;