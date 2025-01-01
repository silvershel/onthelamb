import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import UserDetails from './UserDetails';
import UserEvents from './UserEvents';
import CreateEvent from './CreateEvent';


function UserDashboard() {
    const { currentUser } = useAppContext();
    const [open, setOpen] = useState('my events');

    const openComponent = (componentName) => setOpen(componentName);
    const resetComponent = () => setOpen('my events');
        

    return(
        <div className='ui stackable grid'>
            
            <div className='ui center aligned row'>
                <div className='ui column'>
				<h3>on the lamb</h3>
				<p>Welcome, {currentUser.name}!</p>
                <button className='ui button' onClick={() => openComponent('user details')}>Profile</button>
                <button className='ui button' onClick={() => openComponent('my events')}>My Events</button>
                <button className='ui button' onClick={() => openComponent('create event')} >Create Event</button>
                </div>
			</div> 
            
            {open === 'user details'
            ? <UserDetails /> 
            : null
            }

            {open === 'my events'
            ? <UserEvents /> 
            : null
            }

            {open === 'create event'
            ? <CreateEvent resetComponent={resetComponent}/> 
            : null
            }

        </div>
    )
}

export default UserDashboard;