import styles from './styles.module.css';
import MessagesReceived from './messages';
import { useEffect, useState } from 'react';
import SendMessage from './send-message';
import UsersAndRooms from './userandroom';
import { useSocket } from '../../wsContext';
import { useNavigate } from 'react-router-dom';

const backend_url = "http://" + process.env.REACT_APP_BACKEND_URL + ":" + process.env.REACT_APP_BACKEND_PORT; 

const Chat = ({ username }) => {
	const navigate = useNavigate();
	const [room, setRoom] = useState('');
	const [rooms, setRooms] = useState([]);
	const socket = useSocket();
	const [roomUsers, setRoomUsers] = useState([]);
	const [availableRooms, setAvailableRooms] = useState([]);
	
	const authenticate = () => {
		fetch(backend_url + "/api/authenticate", {
			method: "GET",
			credentials: "include",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Credentials": true
			}
		}).then((res) => res.json()).then((data) => {
			console.log(data.message);
			if (data.message !== 'authenticated') {
				navigate('/', { replace: true });
			}
		}).catch((err) => console.log(err));
	}

	useEffect(() => {
		authenticate();
		if (socket.readyState !== 1) {
			console.log("socket not ready")
			setTimeout(() => { }, 5000);
			return;
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