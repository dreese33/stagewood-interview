import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from 'react-router-dom';


export default function CustomLinkExample() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


function Login() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="auth-container">
          <h1>Sign In:</h1>
          <form>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" size="20"/><br/><br/>
              <label htmlFor="pswd">Password:</label>
              <input type="text" id="pswd" name="pswd"/><br/><br/>
              <span className="create-account">
                <a href="signup" title="Create Account" id="create-account" className="account">
                  Create Account
                </a>
              </span>
              <button type="submit">Submit</button>
          </form>
        </div>
      </header>
    </div>
  );
}


function Signup() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="auth-container">
          <h1>Sign Up:</h1>
          <form>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" size="10"/><br/><br/>
              <label htmlFor="email">Email:</label>
              <input type="text" id="email" name="email"/><br/><br/>
              <label htmlFor="name">Full Name:</label>
              <input type="text" id="fname" name="fname"/><br/><br/>
              <label htmlFor="pswd">Password:</label>
              <input type="text" id="pswd" name="pswd"/><br/><br/>
              <label htmlFor="confirm-pswd">Confirm Password:</label>
              <input type="text" id="confirm-pswd" name="confirm-pswd"/><br/><br/>
              <span className="create-account">
                <a href="/" title="Log In" id="log-in" className="account">
                  Log In Here
                </a>
              </span>
              <button type="submit">Submit</button>
          </form>
        </div>
      </header>
    </div>
  );
}
