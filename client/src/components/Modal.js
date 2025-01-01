import React from 'react';

function Modal({ open, closeComponent }) {

    return (
        <div className={`ui modal ${open ? 'active' : ''}`}>
            
            <button 
                class='ui right floated icon button' 
                onClick={() => closeComponent()}>
                <i class='close icon'></i>
            </button>

            <div>
                {/* Component goes here */}
            </div>
            
        </div>
    );

}

export default Modal;