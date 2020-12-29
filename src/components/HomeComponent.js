import React from 'react';
import { clearLocalStorage } from '../GraphqlQueries.js';

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: localStorage.getItem('token'),
            email: localStorage.getItem('email'),
            name: localStorage.getItem('name'),
            profileUrl: localStorage.getItem('profile')
        }
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(event) {
        clearLocalStorage();
        window.location.href = "./";
    }
    
    render() {
        return (
            <div className="App">
              <header className="App-header">
                <div className="auth-container modulate-auth-width">
                    <button className="logout" onClick={this.handleLogout}>Log Out</button><br/><br/>
                    <img src={this.state.profileUrl} alt='' className="circular"/><br/><br/>
                    <h1>{"Hello " + this.state.username + "!"}</h1>
                    <form>
                        <input className="centered-input" type="text" id="email" value={this.state.email} disabled />
                        <input className="centered-input" type="text" id="name" value={this.state.name} disabled />
                    </form>
                </div>
              </header>
            </div>
        );
    }
}


export default Home;