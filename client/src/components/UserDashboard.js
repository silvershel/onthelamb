import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import UserDetails from './UserDetails';
import UserEdit from './UserEdit';
import MiniCard from './MiniCard';
import Modal from './Modal';
import EventDetails from './EventDetails';


function UserDashboard() {
    const { currentUser } = useAppContext();
    const [open, setOpen] = useState(null);

    const openComponent = (componentName) => setOpen(componentName);
    const closeComponent = () => setOpen(null);
    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);
        
    const userEvents = currentUser.events;
    const userTickets = currentUser.attendees;
    const userBooths = currentUser.vendors;


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
        <div className='ui stackable grid'>
            
            {/* page header & menu */}
            <div className='ui center aligned row'>
                <div className='ui column'>
				<h3>on the lamb</h3>
				<p>Welcome, {currentUser.name}!</p>
                <button onClick={() => openComponent('modal')} className='ui button'>Create Event</button>
                </div>
			</div> 

            {/* modal */}
            <div className={`ui page dimmer ${open === 'modal' ? 'active' : ''}`}>
                <Modal open={open} closeComponent={closeComponent}/>
            </div>

            {/* main container */}
            <div className='ui container'>
                <div className='ui stackable grid'>

                    {/* profile */}
                    <div className='four wide column'>
                        <h3>my info</h3>
                        <img class='ui circular image' src={currentUser.profile_photo}></img>
                        {open === 'profile edit'
                        ? <UserEdit open={open} closeComponent={closeComponent}/>
                        : <UserDetails open={open} openComponent={openComponent}/>
                        }
                    </div>


                    {/* my events */}
                    <div className='eight wide column'>
                    <h3>my events</h3>
                    <div className='ui stackable two column grid'>
                        {userEvents.map((event) => (
                            <div className='ui column' key={event.id}>
                                <div className='ui card'>
                                {open === 'event details'
                                    ? <EventDetails open={open} closeComponent={closeComponent}/>
                                    : <MiniCard event={event} openComponent={openComponent}/>
                                }
                                    {/* <MiniCard event={event} openComponent={openComponent}/>
                                    <EventDetails /> */}
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>

                    {/* general detail */}
                    <div className='four wide column'>
                        <h3>attending</h3>
                        <p>{currentUser.attendees.length}</p>
                        <h3>vending</h3>
                        <p>{currentUser.vendors.length}</p>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default UserDashboard;