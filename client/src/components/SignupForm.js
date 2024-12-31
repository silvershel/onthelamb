import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useFormik } from 'formik';
import * as Yup from "yup";

function SignupForm() {
    const { signup } = useAppContext();


    const checkUsername = (username) => {
        formik.setFieldError("username", "");
        formik.setStatus({usernameAvailable: ""});

        fetch(`/check_username/${username}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) {
                    formik.setFieldError("username", data.error);
                } else {
                    formik.setStatus({ usernameAvailable: data.message });
                }
            })
            .catch((error) => {
                console.error("Username check error:", error.message);
            });
    };

    
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
            username: Yup.string()
                .required("Username is required")
                .matches(/^[\w]+$/, "Username can only contain letters, numbers, and underscores.")
                .min(5, "Username must be at least 5 characters.")
                .test("check-username", "Checking username...", function(value) {
                    if (value) {
                        checkUsername(value);
                    }
                    return true;
                }),
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
            signup(newUser)
        },
    });


    return (
        <div class="ui very padded center aligned container">
            <h1>Sign Up</h1>
            <form class="ui form error success" onSubmit={formik.handleSubmit}>
                <div class="required field">
                    <select 
                        id="user_type" 
                        name="user_type" 
                        value={formik.values.user_type}
                        onChange={formik.handleChange} >
                        <option value="" disabled>Please select a user type: </option>
                        <option value="Sheep">Sheep</option>
                        <option value="Shepherd">Shepherd</option>
                    </select>
                    <div class="ui error message">
                        {formik.errors.user_type}
                    </div>
                </div>
                <div class="required field">
                    <input 
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                     <div class="ui error message">
                        {formik.errors.name}
                    </div>
                </div>
                <div class="required field">
                    <input 
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username (this cannot be changed)"
                        onChange={(e) => {
                            formik.handleChange(e);
                            checkUsername(e.target.value, formik.setFieldError);
                        }}
                        value={formik.values.username}
                    />
                    <div>
                        {!formik.errors.username && formik.status
                            ? <div class="ui success message">{formik.status.usernameAvailable}</div> 
                            : <div class="ui error message">{formik.errors.username}</div>
                        }
                    </div>
                </div>
                <div class="required field">
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
                <button class="ui button" type="submit">Sign Up</button>
                <p>Already have an account? <Link to="/login">Log In</Link></p>
            </form>
        </div>
    )
}

export default SignupForm;