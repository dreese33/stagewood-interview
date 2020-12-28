import React, { Component } from 'react';
import { handleLogin } from '../Login.js';
import { encryptDataSaveKey, loadKeyDecryptData } from '../encrypt.js';
import { CreateUser, Login } from '../GraphqlQueries.js';
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

        //CreateUser("username3", "mail3@mail.com", "rick", "IAmIntentionallyMakignThisLonger12923!!");
        Login("username3", "IAmIntentionallyMakignThisLonger12923!!");
        //localStorage.removeItem('token');


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