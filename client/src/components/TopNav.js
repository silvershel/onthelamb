import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';


function TopNav() {
	const { season, handleThemeSelect, logout } = useAppContext();
	const navigate = useHistory()

	return (
		<div className='ui basic segment'>
			<select className='ui selection dropdown' value={season} onChange={handleThemeSelect}>
				<option value='' disabled>select theme</option>
				<option value='fall'>fall</option>
				<option value='spring'>spring</option>
				<option value='summer'>summer</option>
				<option value='winter'>winter</option>
			</select>

			<button className='ui right floated button' onClick={() => {logout(); navigate.push('/login')}}>LOG OUT</button>
			<button className='ui right floated button' onClick={() => navigate.push(`/dashboard`)}>dashboard</button>
			<button className='ui right floated button' onClick={() => navigate.push('/events')}>events</button>
		</div>
	);
};

export default TopNav;