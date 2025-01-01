import React from "react";
import EventCreate from "./EventCreate";

function Modal({ modalOpen, closeModal }) {

    return (
        <div className={`ui modal ${modalOpen ? 'active' : ''}`}>
            
            <button 
                class="ui right floated icon button" 
                onClick={closeModal}>
                <i class="close icon"></i>
            </button>

            <div>
                <EventCreate />
            </div>
            
        </div>
    );

}

export default Modal;