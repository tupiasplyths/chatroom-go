import styles from './styles.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const UsersAndRooms = ({ socket, rooms, room, setRooms, setRoom, roomUsers}) => {
    const navigate = useNavigate();
    const [roomsList, setRoomsList] = useState([]);
    const roomInput = useRef('');

    const leaveRoom = (roomName) => {
        socket.send(JSON.stringify({
            action: "leave-room",
            message: roomName
        }));
    }

    const switchRoom = (roomName) => {
        setRoom(roomName);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.send(JSON.stringify({ action: 'join-room', message: roomInput.current }));
  
        setRooms([...rooms, { name: roomInput.current, messages: [] }])
        console.log("trying to join room " + roomInput.current + "....");
        console.log("currently joined rooms: " + ++rooms.length);
        roomInput.current = ''
    }

    // document.querySelector(#form).addEventListener('submit', (e) => {
        
    // })

    useEffect(() => {
        if (socket && socket.readyState === 1) {
            console.log("listing users")
            socket.send(JSON.stringify({ action: 'get-users', target: {name: room} }));
        }

    },[room, rooms, socket]) 
    
    //TODO: fix the input, clear on submit
    return (
        <div className={styles.roomAndUsersColumn}> 
            <h2 className={styles.roomTitle}>{room}</h2>
            <div>
                {roomUsers.length > 0 && <h3 className={styles.userListTitle}>Users:</h3>}
                <ul className={styles.usersList}>
                    {roomUsers.map((user, i) => (
                        <li key={i}>
                            <span >
                                {user}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                {rooms.length > 0 && <h3 className={styles.roomListTitle}>Rooms:</h3>}
                <ul className={styles.roomsList}>
                    {rooms.map((room, i) => (
                        <li key={i}>
                            <button className={styles.leaveRoom} onClick={() => switchRoom(room.name)}>
                                {room.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input 
                        className={styles.roomInput} placeholder='Type room name to join' 
                        // value={roomInput.current}
                        onChange={(e) => (roomInput.current = e.target.value)}
                    />
                    
                    <button className={styles.join} type='submit'>
                        Join
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UsersAndRooms;