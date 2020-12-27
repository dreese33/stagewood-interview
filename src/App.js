import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="auth-container">
          <h1>Login:</h1>
          <form>
              <label htmlFor="fname">Username:</label>
              <input type="text" id="username" name="fname"/><br/><br/>
              <label htmlFor="lname">Password:</label>
              <input type="text" id="pass" name="lname"/><br/><br/>
              <button type="submit">Submit</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default App;
