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

        if(password !== confirmPassword) {
            this.setState({errorMessage: "The passwords do not match"});
            return;
        }

        //TODO: Check if user already exists

        //TODO: Sign up
    }

    render() {
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
                <p className="err">{this.state.errorMessage}</p>
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