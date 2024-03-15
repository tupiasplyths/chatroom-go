// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Chat from './pages/chat'
import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('default');
  const [room, setRoom] = useState('pog');
  // const [socket, setSocket] = useState(new WebSocket("ws://localhost:3789/ws?name=abc"))
  const onUsernameChange = (username) => {
    setUsername(username);
    console.log("username changed to " + username + ' ' + typeof username)
  }
  const onRoomNameChange = (room) => {
    setRoom(room);
    console.log("room changed to " + room)
  }
  

  // useEffect(() => {
  //   let tmpSocket = new WebSocket("ws://localhost:3789/ws?name=" + username)
  //   setSocket(tmpSocket)
  //   return () => socket.close();
  // }, [username])

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' 
          element={
            <Home 
              username = {username}              
              room = {room}
              // socket = {socket}
              onUsernameChange={onUsernameChange}
              onRoomNameChange={onRoomNameChange}
              setUsername={setUsername}
              // onNameBeingDone={onNameBeingDone}
            />} 
          />
          <Route path='/chat' 
            element={
              <Chat username={username} room={room} />
            }
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
