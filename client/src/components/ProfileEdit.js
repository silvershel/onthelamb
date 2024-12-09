import React from "react";

function ProfileEdit() {

    return (
        <div>
            <h1>Edit Profile</h1>
            <form>
                <div>
                    <label>First Name:</label>
                    <input type="text"/>
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text"/>
                </div>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default ProfileEdit;