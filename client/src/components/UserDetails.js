import { useAppContext } from "../contexts/AppContext";

function UserDetails({ openComponent }) {
    const { currentUser } = useAppContext();

    return (
        <div>
            <h5>{currentUser.name}</h5>
            <p>user type: {currentUser.user_type}</p>
            <button className="ui button" onClick={() => openComponent('profile edit')}>edit info</button>
        </div>
    )
}

export default UserDetails;