import React from "react";
import EventCreate from "./EventCreate";

function Modal({ open, closeComponent }) {

    return (
        <div className={`ui modal ${open ? 'active' : ''}`}>
            
            <button 
                class="ui right floated icon button" 
                onClick={() => closeComponent()}>
                <i class="close icon"></i>
            </button>

            <div>
                <EventCreate closeComponent={closeComponent}/>
            </div>
            
        </div>
    );

}

export default Modal;