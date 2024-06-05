import styles from './styles.module.css';
import { createRef, useEffect, useRef } from 'react';
import { IoLogOutOutline } from "react-icons/io5";
// import { useNavigate } from 'react-router-dom';

const UsersAndRooms = ({ socket, rooms, room, setRooms, setRoom, roomUsers}) => {
	// const navigate = useNavigate();
	const roomInput = useRef('');
	const roomInputField = createRef();

	const leaveRoom = (roomName) => {
		socket.send(JSON.stringify({
			action: "leave-room",
			message: roomName
		}));

		setRooms(rooms.filter(room => room.name !== roomName));
	}

	const switchRoom = (roomName) => {
		setRoom(roomName);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		socket.send(JSON.stringify({ action: 'join-room', message: roomInput.current }));
  
		setRooms([...rooms, { name: roomInput.current, messages: [] }]);
		console.log("trying to join room " + roomInput.current + "....");
		console.log("currently joined rooms: " + ++rooms.length);
		roomInput.current = '';
		roomInputField.current.value = '';
	}

	useEffect(() => {
		if (socket && socket.readyState === 1) {
			console.log("listing users")
			socket.send(JSON.stringify({ action: 'get-users', target: {name: room} }));
			// socket.send(JSON.stringify({ action: 'get-rooms' }));
		}

	},[room, rooms, socket]) 
	
	//TODO: room search suggestion
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
							<button className={styles.roomsList} onClick={() => switchRoom(room.name)}>
								{room.name}
							</button>

							<span className={styles.leaveRoomButton} onClick={() => leaveRoom(room.name)}><IoLogOutOutline/></span>
						</li>
					))}
				</ul>
			</div>
			<div className={styles.bottomDiv}>
				<form onSubmit={handleSubmit}>
					<input 
						className={styles.roomInput} 
						placeholder='Type room name to join' 
						onChange={(e) => (roomInput.current = e.target.value)}
						ref={roomInputField}
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