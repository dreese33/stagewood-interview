import React from 'react'

class Home extends React.Component {

    constructor(props) {
        //this.handleUsernameChange = this.handleUsernameChange.bind(this);
        super(props);

        this.state = {
            username: localStorage.getItem('token'),
            email: localStorage.getItem('email'),
            name: localStorage.getItem('name'),
            profileUrl: localStorage.getItem('profile')
        }
    }
    
    //<img src={/*get image*/} alt="Girl in a jacket" width="500" height="600"/>
    render() {
        //console.log("Rendered");
        return (
            <div className="App">
              <header className="App-header">
                <div className="auth-container modulate-auth-width">
                    <img src={this.state.profileUrl} alt='' className="circular"/><br/><br/>
                    <form>
                        <input className="centered-input" type="text" id="username" value={this.state.username} disabled />
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