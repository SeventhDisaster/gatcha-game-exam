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

        //TODO: Check if password is correct

        //TODO: Do login
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