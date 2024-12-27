import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useFormik } from 'formik';
import * as Yup from "yup";

function SignupForm() {
    const { signup } = useAppContext();

    // Formik things to explore
    // .setFieldValue('email', 'test@example.com');
    // .setSubmitting(isSubmitting)
    // .resetForm()


    const checkUsername = (username) => {
        // formik.setFieldError("username", "");
        // formik.setStatus({usernameAvailable: ""});

        fetch(`/check_username/${username}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) {
                    formik.setFieldError("username", data.error);
                    // formik.setStatus({usernameAvailable: ""});
                } else {
                    // formik.setFieldError("username", "");
                    formik.setStatus({ usernameAvailable: data.message });
                }
            })
            .catch((error) => {
                // formik.setFieldError("username", "Error checking username.");
                // formik.setStatus({usernameAvailable: ""});
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
            name: Yup.string().required("A name is required"),
            username: Yup.string()
                .required("A username is required")
                .min(5, "Username must be at least 5 characters.")
                .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores') // implement .matches into backend.
                .test('check-username', 'Checking username...', function(value) {
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
        <div>
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
                    <p>{formik.errors.name}</p>
                </div>
                <div>
                    <label>Username (this cannot be changed):</label>
                    <input 
                        type="text"
                        id="username"
                        name="username"
                        onChange={(e) => {
                            formik.handleChange(e);
                            checkUsername(e.target.value, formik.setFieldError);
                        }}
                        value={formik.values.username}
                    />
                    <p>{formik.errors.username}</p>
                    {formik.status && formik.status.usernameAvailable && (
                        <div className="success">{formik.status.usernameAvailable}</div>
                    )}
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