import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UsersAndRooms = ({ socket, username, rooms, room}) => {
    const [roomUsers, setRoomUsers] = useState([]);
    const navigate = useNavigate();

    const leaveRoom = (roomName) => {
        socket.send(JSON.stringify({
            action: "leave-room",
            message: roomName
        }));
    }

    return (
        <div className={styles.roomAndUsersColumn}> 
            <h2 className={styles.roomTitle}>{room}</h2>

            <div>
                
            </div>
        </div>
    )
}