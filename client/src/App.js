import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  // State to store the welcome message from the API
  const [welcomeMessage, setWelcomeMessage] = useState('');

  // useEffect to call the API when the component mounts
  useEffect(() => {
    // Fetching the welcome message from the `/api/welcome` endpoint
    fetch('/api/welcome')
        .then(response => response.text()) // Assuming the response is plain text
        .then(message => {
          setWelcomeMessage(message); // Update the state with the fetched welcome message
        })
        .catch(error => {
          console.error('Error fetching welcome message:', error);
          setWelcomeMessage('Failed to fetch welcome message'); // Set error message in state
        });
  }, []); // The empty array ensures this effect runs only once after the initial render

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Edit <code>src/App.js</code> and save to reload.</p>
          {/* Display the welcome message fetched from the API */}
          <p>{welcomeMessage || 'Loading...'}</p>
          <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
  );
}

export default App;