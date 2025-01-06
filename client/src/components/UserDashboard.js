import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import UserProfile from './UserProfile';
import UserEvents from './UserEvents';
import CreateEvent from './CreateEvent';


function UserDashboard() {
    const { currentUser } = useAppContext();
    const [open, setOpen] = useState('my events');

    const openComponent = (componentName) => setOpen(componentName);
    const resetComponent = () => setOpen('my events');
        

    return(
        <div className='ui basic segment'>
            
            <div className='ui basic segment'>
                <div className='ui column'>
				<h2>on the lamb</h2>
				<p>Welcome, {currentUser.name}!</p>
                <button className='ui button' onClick={() => openComponent('user details')}>Profile</button>
                <button className='ui button' onClick={() => openComponent('my events')}>My Events</button>
                <button className='ui button' onClick={() => openComponent('create event')} >Create Event</button>
                </div>
			</div> 
            
            {open === 'user details' && (
            <UserProfile open={open}/> 
            )}

            {open === 'my events' && (
            <UserEvents /> 
            )}

            {open === 'create event' && (
            <CreateEvent resetComponent={resetComponent}/> 
            )}

        </div>
    )
}

export default UserDashboard;