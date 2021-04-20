import '../App.css';
import React from 'react';
import {Spinner} from 'react-bootstrap';

const Preloader = () => {
    return (
        <div className="preloader-container">
            <div className="preloader">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        </div>
    );
}

export default Preloader;