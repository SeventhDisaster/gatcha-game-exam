import React from "react";
import { Link , withRouter } from "react-router-dom";

class HeaderBar extends React.Component {
    constructor(props){
        super(props);
    }

    renderLoggedIn(userId){
        return(
            <React.Fragment>
                <div className="header-user">
                    <p>Welcome to the site {userId}!</p>
                    <button className="header-button logout" onClick={this.doLogout}>
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

    doLogout = async () => {
        const url = "/api/logout";

        let response;

        try {
            response = await fetch(url, {method: "POST"});
        } catch (e) {
            throw "Failed to connect to server: " + e;
        }

        if(response.status !== 204) {
            throw "Error when connecting to server - Status Code: " + response.status;
        }

        if(this.props.socket) {
            if (this.props.user) {
                this.props.socket.send(
                    JSON.stringify({clearUserId: this.props.user.userId})
                );
            }
        }

        this.props.setCurrentUser(null);
        this.props.history.push("/");
    }

    render() {
        const user = this.props.user;
        let content;

        if(!user){
            content = this.renderLoggedOut();
        } else {
            content = this.renderLoggedIn(user.userId);
        }

        return (
            <div className="header-container">
                <Link to="/" className="header-title">Hiiro</Link>

                {content}
            </div>
        )
    }
}

export default withRouter(HeaderBar);