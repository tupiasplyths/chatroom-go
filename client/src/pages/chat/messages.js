import styles from './styles.module.css';
import { useState, useEffect } from 'react';

const Messages = ({ socket, rooms, room, setRooms, roomUsers, setRoomUsers}) => {
    const [currentRoomMessages, setCurrentRoomMessages] = useState([]);

    
    useEffect(() => {
        socket.addEventListener('message', (event) => {
            console.log("Message from server ", event.data)
            handleNewMessage(event)  
        });
        if (socket && socket.readyState === 1) {
            socket.send(JSON.stringify({ action: 'get-users', target: {name: room} }));
        }
        function handleNewMessage(event) {
            let data = event.data
            data = data.split(/\r?\n/)
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                let msg =JSON.parse(data[i]);
                switch (msg.action) {
                    case "send-message": 
                        const targetRoom = findRoom(msg.target.name);
                        if (typeof targetRoom !== 'undefined') {
                            
                            // console.log(targetRoom.messages);
                            const appendedRoomMessage = rooms.map((room, i) => {
                                if (room.name === targetRoom.name) {
                                    return {
                                        name: room.name,
                                        messages: [...room.messages, msg]
                                    }
                                } else {
                                    return room;
                                }
                            });
                            setRooms(appendedRoomMessage);
                            console.log(rooms)
                            
                            // console.log(currentRoomMessages);
                        }
                        break;
                    case 'list-users': 
                        console.log(msg);
                        let users = msg.message.slice(1,-1);
                        setRoomUsers(users.split(' '));
                        
                        break;
                    default: 
                        break;
                }
                
            }
        }
        function findRoom(name) {
            if (rooms && rooms.length > 0) {
                for (let i = 0; i < rooms.length; i++) {
                    if (!rooms[i]) {
                        console.error(`rooms[${i}] is undefined`);
                        continue;
                    }
            
                    if (rooms[i].name === name) {
                        console.log("found room " + name);
                        return rooms[i];
                    }
                }
            }
        }
        const currentRoom = findRoom(room);
        if (currentRoom) {
            setCurrentRoomMessages(currentRoom.messages);
        } else {
            //do something
        }
        console.log(roomUsers);
        return () => socket.removeEventListener('message', handleNewMessage);
    },[room, currentRoomMessages, rooms]);


    return (
        <div className={styles.messagesColumn}>
            {currentRoomMessages.map((msg, i) => (
                <div className={styles.message} key={i}>
                    <div style= {{display: 'flex', justifyContent: 'space-between'}}>
                        <span className={styles.msgMeta}>{msg.sender.Name}</span>
                    </div>
                    <p className={styles.msgText}>{msg.message}</p>
                    <br />
                </div>
            ))}
        </div>
        
    );

};

export default Messages;