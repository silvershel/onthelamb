import React from "react";
import { useAppContext } from "../contexts/AppContext";
import UserNav from "./UserNav";

function UserDashboard() {
    const { currentUser } = useAppContext();

    return(
        <div class="ui center aligned container">
            <p>{currentUser.name}'s' dashboard</p>
            <UserNav />
        </div>
    )
}

export default UserDashboard;