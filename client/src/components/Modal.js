import React from 'react';

function Modal({ open, closeComponent }) {

    return (
        <div className={`ui modal ${open ? 'active' : ''}`}>
            
            <button 
                className='ui right floated icon button' 
                onClick={() => closeComponent()}>
                <i className='close icon'></i>
            </button>

            <div>
                {/* Component goes here */}
            </div>
            
        </div>
    );

}

export default Modal;