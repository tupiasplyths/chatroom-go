import styles from './styles.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const UsersAndRooms = ({ socket, username, rooms, room, setRooms, setRoom}) => {
    const [roomUsers, setRoomUsers] = useState([]);
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

    return (
        <div className={styles.roomAndUsersColumn}> 
            <h2 className={styles.roomTitle}>{room}</h2>

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
                        onChange={(e) => (roomInput.current = e.target.value)}
                        // value={roomInput.current}
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