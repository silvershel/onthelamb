import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import UserNav from "./UserNav";
import MiniCard from "./MiniCard";
import EventCreate from "./EventCreate";

function UserDashboard() {
    const { currentUser } = useAppContext();
    const [open, setOpen] = useState(false);
        
    const userEvents = currentUser.events;

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    return(
        <div className="ui stackable grid container">

            <div className="ui center aligned row">
                <div className="ui column">
                    <p>{currentUser.name}'s' dashboard</p>
                    <UserNav />
                    <button onClick={openModal} className="ui button">Create Event</button>
                </div> 
            </div>   

            <div className="ui row">
                {/* Modal */}
                <EventCreate open={open} closeModal={closeModal}/>
            </div>           

            <div className="ui row">
                <div className="ui column">
                    <h3>my events</h3>
                </div>
            </div> 

            <div className="ui four column row">
                {userEvents.map((event) => (
                    <div className="ui column" key={event.id}>
                        <div className="ui card">
                            <MiniCard event={event} />
                        </div>
                    </div>
                ))}
            </div>

        </div>

    )
}

export default UserDashboard;