import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import UserProfileEdit from './UserProfileEdit';

function UserProfile() {
    const { currentUser } = useAppContext();
    const [open, setOpen] = useState(null)

    const openComponent = (componentName) => setOpen(componentName);
    const closeComponent = () => setOpen(null)

    return (
        <div className='ui center aligned basic segment'>

            <div className='ui center aligned row'>
                <div className='ui basic segment'>
                    <div className='ui column'>
                    <h3>my info</h3>
                    <img className='ui large middle aligned circular image' src={currentUser.profile_photo}></img>
                </div>

                    {open === 'profile edit' 
                    ? <UserProfileEdit closeComponent={closeComponent}/> 
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

export default UserProfile;