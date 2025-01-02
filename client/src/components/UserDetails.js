import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import UserEdit from './UserEdit';

function UserDetails() {
    const { currentUser } = useAppContext();
    const [open, setOpen] = useState(null)

    const openComponent = (componentName) => setOpen(componentName);
    const closeComponent = () => setOpen(null)

    return (
        <div className='ui center aligned basic segment'>

            {/* user details */}
            <div className='ui center aligned row'>
                <div className='ui column'>
                <h3>my info</h3>
                <img class='ui medium middle aligned circular image' src={currentUser.profile_photo}></img>

                    {open === 'profile edit' 
                    ? <UserEdit closeComponent={closeComponent}/> 
                    : <div className='ui basic segment'>
                        <p>Name: {currentUser.name}</p>
                        <p>User Type: {currentUser.user_type}</p>
                        <button className='ui button' onClick={() => openComponent('profile edit')}>edit info</button>
                    </div>
                    }
    
                </div>
            </div>

        </div>
    )
}

export default UserDetails;