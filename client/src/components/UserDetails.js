import { useAppContext } from '../contexts/AppContext';

function UserDetails({ openComponent }) {
    const { currentUser } = useAppContext();

    return (
        <div>
            <h3>my info</h3>
            <img class='ui circular image' src={currentUser.profile_photo}></img>
            <h5>{currentUser.name}</h5>
            <p>user type: {currentUser.user_type}</p>
            <button className='ui button' onClick={() => openComponent('profile edit')}>edit info</button>
        </div>
    )
}

export default UserDetails;