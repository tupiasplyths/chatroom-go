// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Chat from './pages/chat'
import { useState } from 'react';
import { SocketProvider } from './wsContext';


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
          <Route path='/' 
          element={
            <Home 
              username = {username}              
              // room = {room}
              // socket = {socket}
              onUsernameChange={onUsernameChange}
              // onRoomNameChange={onRoomNameChange}
              setUsername={setUsername}
              // onNameBeingDone={onNameBeingDone}
            />} 
          />
          <Route path='/chat' 
            element={
              <SocketProvider username={username}>
                <Chat username={username} />
              </SocketProvider>
            }
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
