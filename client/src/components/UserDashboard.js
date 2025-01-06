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
				<h3>Welcome, {currentUser.name}!</h3>
                <button className='ui button' onClick={() => openComponent('user details')}>my profile</button>
                <button className='ui button' onClick={() => openComponent('my events')}>my events</button>
                <button className='ui button' onClick={() => openComponent('create event')} >create event</button>
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