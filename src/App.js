import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import SignupFormComponent from './components/SignupForm.js';
import LoginFormComponent from './components/LoginForm.js';
import ProtectedRoute from './components/ProtectedRoute.js';


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
          <ProtectedRoute path="/home">
            <Home />
          </ProtectedRoute>
        </Switch>
      </div>
    </Router>
  );
}


function Login() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="auth-container modulate-auth-width">
          <h1>Sign In:</h1>
          <LoginFormComponent/>
        </div>
      </header>
    </div>
  );
}


function Signup() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="auth-container modulate-auth-width">
          <h1>Sign Up:</h1>
          <SignupFormComponent/>
        </div>
      </header>
    </div>
  );
}

function Home() {
  return (
    <div className="App">
      <header className="App-header">
          <h1>Home</h1>
      </header>
    </div>
  );
}
