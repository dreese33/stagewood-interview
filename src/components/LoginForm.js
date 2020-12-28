import React, { Component } from 'react';
import { EmailExists, GetUser, UserExists, CreateUser } from '../GraphqlQueries.js';
//import { GetUser } from '../GraphqlQueries.js';

class LoginFormComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(event) {
        console.log(event.target.value);
        this.setState({value: event.target.value});
    }

    handlePasswordChange(event) {
        console.log(event.target.value);
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        //Testing code here
        //console.log(JSON.stringify(GetUser({ "username": "dreese33" })));
        GetUser("dreese33");
        EmailExists("dylanjacobreese@gmail.com");
        UserExists("dreese33");
        CreateUser("name", "email@mail.com", "Dylan", "randompassword234231");
        
        //console.log("Submitted");
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