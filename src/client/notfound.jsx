import React from "react";
import { Link } from "react-router-dom";

//This page is the 404 page
export class NotFound extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="notfound-container">
                <h1 className="notfound-h">We lost you!</h1>
                <div>
                    <p className="notfound-p">Status Code: 404 - Not Found</p>
                    <p className="notfound-text">It seems you tried to look for a page that did not exist.</p>
                </div>
                <br/>
                <Link className="notfound-link" to="/" tabIndex="0">Go back</Link>
            </div>
        )
    }
}