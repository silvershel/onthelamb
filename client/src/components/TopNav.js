import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';


function TopNav() {
	const { logout, currentUser } = useAppContext();
	const navigate = useHistory()
	const [season, setSeason] = useState('winter');

	useEffect(() => {
		const savedSeason = localStorage.getItem('season');
		console.log('Saved season from localStorage:', savedSeason);
		if (savedSeason) {
			setSeason(savedSeason);
		}
		}, []);

	useEffect(() => {
		const container = document.getElementById('app-container');
		if (container) {
			container.classList.remove('fall', 'spring', 'summer', 'winter');
			container.classList.add(season);
		}
		localStorage.setItem('season', season);
		}, [season]);

	const handleThemeSelect = (e) => {
		setSeason(e.target.value);
		};

	return (
		<div>
			<div className='ui basic segment' style={{ display: 'flex', justifyContent: 'space-between'}}>
				<select className='ui selection dropdown' value={season} onChange={handleThemeSelect}>
					<option value='' disabled>select theme</option>
					<option value='fall'>fall</option>
					<option value='spring'>spring</option>
					<option value='summer'>summer</option>
					<option value='winter'>winter</option>
				</select>

				{currentUser && (
					<div>
						<button className='ui right floated button' onClick={() => {logout(); navigate.push('/login')}}>LOG OUT</button>
						<button className='ui right floated button' onClick={() => navigate.push(`/dashboard`)}>dashboard</button>
						<button className='ui right floated button' onClick={() => navigate.push('/events')}>events</button>
					</div>
				)}
				
			</div>
		</div>
	);
};

export default TopNav;