import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import UserNav from "./UserNav";
import MiniCard from "./MiniCard";
import Modal from "./Modal";

function UserDashboard() {
    const { currentUser } = useAppContext();
    const [modalOpen, setModalOpen] = useState(false);
        
    const userEvents = currentUser.events;

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    // NOTES
        // add values and indexes to divs for easy reference for functions
        
    // <App />
        // Routes
        // <Login />
        // <Dashboard />

    // <Dashboard />
        // <ControlPanel /> (only returns this component)
    
    // Control Panel (THIS COMPONENT)
        // Tabs (sidebar menu)
            // Tab Panel > Logo/Instructions
            // Tab Panel > <EventContainer />
            // Tab Panel > Logout

    // <EventContainer />
        // handles main event delete and deletes of related models owned by event
        // <NewEventModal />
        // <EventCard2 /> Maps over events and returns EventCard2 with props.

    // <NewEventModal /> (main modal window)
        // <NewEvent /> (new event form)

    // <EventCard2 /> (grid with columns and cards)
        // <DetailsCont />
        // <DetailsCont2 />


    return(
        <div className="ui stackable grid">
            
            {/* page header */}
            <div className="ui center aligned row">
                <div className="ui column">
				<h3>on the lamb</h3>
				<p>Welcome, {currentUser.name}!</p>
                </div>
			</div>

            {/* menu */}
            <div className="ui center aligned row">
                <div className="ui column">
                    <UserNav />
                    <button onClick={openModal} className="ui button">Create Event</button>
                </div> 
            </div>   

            {/* modal */}
            <div className={`ui page dimmer ${modalOpen ? 'active' : ''}`}>
                <Modal modalOpen={modalOpen} closeModal={closeModal}/>
            </div>           

            {/* section header */}
            <div className="ui row">
                <div className="ui column">
                    <h3>my events</h3>
                </div>
            </div> 

            {/* events grid */}
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