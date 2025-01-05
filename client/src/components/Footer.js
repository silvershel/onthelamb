import React from 'react';
// import { useHistory } from 'react-router-dom';
// import { useAppContext } from '../contexts/AppContext';


function Footer() {
	// const { season, handleThemeSelect, logout } = useAppContext();
	// const navigate = useHistory()

	return (
		<div className='ui footer'>
			<div className='ui basic center aligned segment'>
                <div className='ui grid'>
                    <div className='row'>
                        <div className='sixteen wide column'>
                            <p>designed and developed by shelli silverstein</p>
                        </div>
                    </div>
                </div>
            </div>
		</div>
	);
};

export default Footer;