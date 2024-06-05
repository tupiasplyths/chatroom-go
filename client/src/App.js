// import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import './App.css';
import Home from './pages/home';
import Chat from './pages/chat'
import Signup from './pages/account/signup'
import { SocketProvider } from './wsContext';
import Holodex from './pages/holodex';

function App() {
  const [username, setUsername] = useState('default');

  const onUsernameChange = (username) => {
    setUsername(username);
    console.log("username changed to " + username + ' ' + typeof username)
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/home' 
          element={
            <Home             
              onUsernameChange={onUsernameChange}
            />} 
          />
          <Route path='/holodex' 
          element={
            <Holodex
            />} 
          />
          <Route path='/chat' 
            element={
              <SocketProvider username={username}>
                <Chat username={username} />
              </SocketProvider>
            }
          />
          <Route path='/'
            element={
              <Signup />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
