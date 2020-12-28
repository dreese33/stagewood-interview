import React, { Component } from 'react';
import { CreateUser } from '../GraphqlQueries';

class SignupFormComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            password: '',
            email: '',
            confirm: ''
        };
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleConfirmChange = this.handleConfirmChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
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

    handleEmailChange(event) {
        this.setState({
            email: event.target.value
        });
    }

    handleConfirmChange(event) {
        this.setState({
            confirm: event.target.value
        });
    }

    handleNameChange(event) {
        this.setState({
            name: event.target.value
        });
    }

    handleSubmit(event) {
        //TODO -- form validation here
        CreateUser(this.state.username, this.state.email, this.state.name, this.state.password);
        event.preventDefault();
    }


    render() {
      return (
        <form onSubmit={this.handleSubmit}>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" size="10" onChange={this.handleUsernameChange}/><br/><br/>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" onChange={this.handleEmailChange}/><br/><br/>
              <label htmlFor="name">Full Name:</label>
              <input type="text" id="fname" name="fname" onChange={this.handleNameChange}/><br/><br/>
              <label htmlFor="pswd">Password:</label>
              <input type="password" id="pswd" name="pswd" onChange={this.handlePasswordChange}/><br/><br/>
              <label htmlFor="confirm-pswd">Confirm Password:</label>
              <input type="password" id="confirm-pswd" name="confirm-pswd" onChange={this.handleConfirmChange}/><br/><br/>
              <label className="">Profile Picture: </label><br/>
              <input id="image-file" type="file" accept="image/*"/><br/><br/>
              <span className="create-account">
                <a href="/" title="Log In" id="log-in" className="account">
                  Log In Here
                </a>
              </span>
              <button type="submit">Submit</button>
          </form>
      );
    }
}
export default SignupFormComponent;