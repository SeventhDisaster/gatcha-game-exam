import React from "react";
import { Link } from "react-router-dom";

export class HeaderBar extends React.Component{
    constructor(props){
        super(props);
    }

    renderLoggedIn(userId){
        return(
            <React.Fragment>
                <div className="header-user">
                    <p>Welcome to the site {userId}!</p>
                    <button className="header-button logout" to="/signup"  tabIndex="0">
                        Logout
                    </button>
                </div>
            </React.Fragment>
        )
    }

    renderLoggedOut(){
        return(
            <React.Fragment>
                <div className="header-user">
                    <Link className="header-button" to="/login"  tabIndex="0">Login</Link>
                    <p>or</p>
                    <Link className="header-button" to="/signup" tabIndex="0">Sign Up</Link>
                </div>
            </React.Fragment>
        )
    }

    render() {
        const userId = this.props.userId;
        let content;

        if(!userId){
            content = this.renderLoggedOut();
        } else {
            content = this.renderLoggedIn(userId);
        }

        return (
            <div className="header-container">
                <Link to="/" className="header-title"> Title</Link>

                {content}
            </div>
        )
    }
}