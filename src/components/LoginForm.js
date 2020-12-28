import React, { Component } from 'react';
import { Login } from '../GraphqlQueries.js';

class LoginFormComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({
            username: event.target.value
        });
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value
        });
    }


    handleSubmit(event) {
        
        Login(this.state.username, this.state.password);

        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" size="20" onChange={this.handleUsernameChange}/><br/><br/>
                <label htmlFor="pswd">Password:</label>
                <input type="password" id="pswd" name="pswd" onChange={this.handlePasswordChange}/><br/><br/>
                <span className="create-account">
                <a href="signup" title="Create Account" id="create-account" className="account">
                    Create Account
                </a>
                </span>
                <button type="submit">Submit</button>
            </form>
        );
    }
}
export default LoginFormComponent;