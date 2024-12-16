import React from "react";

function ProfileEdit() {

    return (
        <div>
            <h1>Edit Profile</h1>
            <form>
                <div>
                    <label>Name:</label>
                    <input type="text"/>
                </div>
                <div>
                    <label>Bio:</label>
                    <input type="text"/>
                </div>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default ProfileEdit;