import React, { Component } from 'react';
import { CreateUser, EMAIL_EXISTS, USER_EXISTS, client } from '../GraphqlQueries';
import axios from 'axios';
import { storage } from '../firebase/index.js';
import { Redirect } from 'react-router-dom';
import { checkEmptyFields,
            validateEmail } from '../FormValidation.js';

class SignupFormComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            password: '',
            email: '',
            confirm: '',
            file: null
        };
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleConfirmChange = this.handleConfirmChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSaveImage = this.handleSaveImage.bind(this);
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

    handleSaveImage(event) {
        
        if (event.target.files[0]) {
            let image = event.target.files[0];

            //Convert to png/rename
            let blob = image.slice(0, image.size, 'image/png'); 
            let newFile = new File([blob], 'profilePicture.png', {type: 'image/png'});
            console.log(newFile.name);

            this.setState({
                file: newFile
            });
        }
    }

    handleSubmit(event) {
        //TODO -- form validation here

        const email = this.state.email;
        const username = this.state.username;
        const name = this.state.name;
        const password = this.state.password;
        const confirm = this.state.confirm;
        const file = this.state.file;

        let message = '';
        let formValidated = true;
        
        if (!validateEmail(email)) {
            message = 'Email is invalid';
            formValidated = false;
        }

        if (password !== confirm) {
            message = 'Passwords do not match'
            formValidated = false;
        }

        //Check if email and or username exists


        if (checkEmptyFields([username,
            email,
            name,
            password,
            confirm])) {

            message = 'All fields must have a value';
            formValidated = false;
        }

        //Creates user if form is validated
        function validateAndCreate() {
            if (formValidated) {
                if (file != null) {
                    const imageName = username + file.name;
                    console.log(imageName);
                    console.log(username);
                    const uploadTask = storage.ref(`images/${imageName}`).put(file);
                    uploadTask.on(
                        "state_changed",
                        snapshot => {},
                        error => {
                            console.log(error);
                        },
                        () => {
                            storage.ref('images').child(imageName).getDownloadURL().then(url => {
                                console.log("Firebase image url is: " + url);
                                CreateUser(username, 
                                    email, 
                                    name, 
                                    password, 
                                    url);
                            });
                        }
                    );
                } else {
                    CreateUser(username, email, name, password, '');
                }
            } else {
                alert(message);
            }
        }


        function emailExists() {
            client.query({
                query: EMAIL_EXISTS,
                variables: { email: email },
            })
            .then((response) => {
                console.log(response.data);
                if (response.data.emailExists === null) {
                    validateAndCreate();
                } else {
                    alert("Email already exists");
                }
            })
            .catch((err) => console.error(err));
        }


        //Check if username exists
        client.query({
            query: USER_EXISTS,
            variables: { username: username },
        })
        .then((response) => {
            console.log(response.data);
            if (response.data.userExists === null) {
                emailExists();
            } else {
                alert("Username already exists")
            }
        })
        .catch((err) => console.error(err));

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
              <input id="image-file" type="file" accept="image/*" onChange={this.handleSaveImage}/><br/><br/>
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