import React from "react";

export class SignUp extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            userId: "",
            password: "",
            confirmPassword: "",
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

    onEditConfirmPassword = event => {
        this.setState({confirmPassword: event.target.value, errorMessage: null})
    }

    passwordDoesMeetCriteria = (password) => {
        //Regular expression for password strength. (Only 1 Upper, lower and digit)
        const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/;
        return regexp.test(password);
    }

    doSignUp = async () => {
        const {userId, password, confirmPassword} = this.state

        if(!userId || !password || !confirmPassword){
            this.setState({errorMessage: "Please fill in the required fields"});
            return;
        }

        if(!this.passwordDoesMeetCriteria(password)){
            this.setState({errorMessage: "Password does not meet the criteria"});
            return;
        }

        if(confirmPassword !== password) {
            this.setState({errorMessage: "The passwords do not match"});
            return;
        }

        const url ="/api/signup";

        const payload = {userId: userId, password: password}

        let response;

        try {
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
        } catch (e) {
            this.setState({errorMessage: "Failed to connect to server:" + e});
            return;
        }

        if(response.status === 400) {
            this.setState({errorMessage: "Username is already taken"})
        }

        if(response.status !== 201) {
            this.setState({errorMessage:
                    "Error when connecting to server - Status code: " + response.status
            });
            return;
        }

        this.setState({errorMessage: null});

        await this.props.fetchAndUpdateUserInfo();
        this.props.history.push("/"); //Return to front page
    }

    render() {
        let content;

        if(this.state.errorMessage){
            content = <p className="err">{this.state.errorMessage}</p>
        }

        return (
            <div className="auth-container">
                <h3>Sign up</h3>
                <div className="auth-requirement">
                    <h4>Password Requirements:</h4>
                    <ul>
                        <li>At least 6 character total</li>
                        <li>At least 1 upper case character (A-Z)</li>
                        <li>At least 1 lower case character (a-z)</li>
                        <li>At least 1 digit (0-9)</li>
                    </ul>
                </div>
                {content}
                <p className="psa">PSA: This application currently only stores user information in memory and is intended for running locally only. <br/>
                    Should it be deployed on a real server, please do not use any passwords/usernames you would use elsewhere, as encryption is not implemented.</p>

                <div className="auth-form">
                    <p>Username: *</p>
                    <input type="text"
                           placeholder="Username"
                           onChange={this.onEditUserId}/>

                    <p>Password: *</p>
                    <input type="password"
                           style = {{border: this.passwordDoesMeetCriteria(this.state.password) ? "solid green 1px" : "solid red 1px"}}
                           placeholder="Password"
                           onChange={this.onEditPassword}/>

                    <p>Confirm Password: *</p>
                    <input type="password"
                           placeholder="Confirm Password"
                           onChange={this.onEditConfirmPassword}/>
                </div>

                <button className="header-button" onClick={this.doSignUp}>
                    Sign Up
                </button>
            </div>
        )
    }
}