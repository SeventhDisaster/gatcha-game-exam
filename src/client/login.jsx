import React from "react";

export class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userId: "",
            password: "",
            errorMessage: null
        }
    }

    // Listeners for input fields
    onEditUserId = event => {
        this.setState({userId: event.target.value, errorMessage: null})
    }


    onEditPassword = event => {
        this.setState({password: event.target.value, errorMessage: null})
    }

    doLogin = async () => {
        const {userId, password} = this.state

        const url = "/api/login";

        const payload = {userId: userId, password: password}

        let response;

        try{
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
        } catch (e) {
            this.setState({errorMessage: "Failed to connect to server: " + e});
            return;
        }

        if(response.status === 401) {
            this.setState({errorMessage: "Invalid username / password"});
            return;
        }

        if(response.status !== 204) {
            this.setState({errorMessage: "An error occured - Status Code: " + response.status})
            return;
        }

        this.setState({errorMessage: null});
        await this.props.fetchAndUpdateUserInfo();
        this.props.history.push("/")
    }

    render() {
        return (
            <div className="auth-container">
                <h3>Login</h3>
                <p className="err">{this.state.errorMessage}</p>
                <div className="auth-form">
                    <p>Username: *</p>
                    <input type="text"
                           placeholder="Username"
                           onChange={this.onEditUserId}/>

                    <p>Password: *</p>
                    <input type="password"
                           placeholder="Password"
                           onChange={this.onEditPassword}/>
                </div>

                <button className="header-button" onClick={this.doLogin}>
                    Login
                </button>
            </div>
        )
    }
}