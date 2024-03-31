import styles from './styles.module.css';
import MessagesReceived from './messages';
import { useEffect, useState } from 'react';
import SendMessage from './send-message';
import UsersAndRooms from './userandroom';
import { useSocket } from '../../wsContext';

// const socket = new WebSocket("ws://localhost:3789/ws?name=abc");

const Chat = ({ username }) => {
    const [room, setRoom] = useState('');
    const [rooms, setRooms] = useState([]);
    const socket = useSocket();
    const [roomUsers, setRoomUsers] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    useEffect(() => {
        if (socket.readyState !== 1) {
            console.log("socket not ready")
            setTimeout(() => { }, 5000);
        } else {
            console.log("connected")
        }
        console.log("got username " + username)
        
        return () => socket.close(1000, "closed");
    }, []);

    
    
    return (
        <div className={styles.chatContainer}>
            <UsersAndRooms 
                socket={socket} 
                // username={username} 
                roomUsers={roomUsers} 
                // setRoomUsers={setRoomUsers} 
                rooms={rooms} 
                room={room} 
                setRooms={setRooms} 
                setRoom={setRoom} 
                availableRooms={availableRooms}
            />
            <div> 
                <MessagesReceived 
                    socket={socket} 
                    setRoomUsers={setRoomUsers} 
                    rooms={rooms} 
                    room={room} 
                    setRooms={setRooms}
                    setAvailableRooms={setAvailableRooms}
                />   
                <SendMessage 
                    socket={socket} 
                    room={room} 
                    rooms={rooms} 
                    setRooms={setRooms} 
                />
            </div>
        </div>
    )
}

export default Chat;