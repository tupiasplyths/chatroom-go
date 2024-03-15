import styles from './styles.module.css';
import { useState, useEffect } from 'react';

const Messages = ({ socket, rooms, room, setRooms }) => {
    const [currentRoomMessages, setCurrentRoomMessages] = useState([]);

    
    useEffect(() => {
        socket.addEventListener('message', (event) => {
            handleNewMessage(event)  
            console.log("Message from server ", event.data)
        });
    
        function findRoom(name) {
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].name === name) {
                    console.log("found room " + name)
                    return rooms[i];
                }
            }
        }
        function handleNewMessage(event) {
            let data = event.data
            data = data.split(/\r?\n/)
            
        
            for (let i = 0; i < data.length; i++) {
                let msg =JSON.parse(data[i]);
                console.log(msg)
                // console.log(rooms)
                const targetRoom = findRoom(msg.target.name);
                if (typeof targetRoom !== 'undefined') {
                    
                    console.log(targetRoom.Messages)
                    // targetRoom.messages.push(msg);
                    const appendRoomMessage = rooms.map((room, i) => {
                        if (room.name === targetRoom.name) {
                            return {
                                name: room.name,
                                messages: [...room.messages, msg]
                            }
                        } else {
                            return room;
                        }
                    });
                    setRooms(appendRoomMessage);
                    console.log(rooms)
                    setCurrentRoomMessages(findRoom(room).messages);
                    console.log(currentRoomMessages);
                }
            }
        }

        
        
        // return () => socket.off('receive_message');
    }, [socket, rooms, room, setRooms, currentRoomMessages]);

    // function formatDate(timestamp) {
    //     const date = new Date(timestamp);
    //     return date.toLocaleString();
    // }
    

    const handleOnClick = () => {
        socket.send(JSON.stringify({ action: 'join-room', message: room }));
        setRooms([
            ...rooms,
            {
                name: room,
                messages: [],
            }
        ])
        console.log("trying to join room " + room + "....")
    }

    return (
        <div className={styles.messagesColumn}>
            { currentRoomMessages.map((msg, i) => (
                <div className={styles.message} key={i}>
                    <div style= {{display: 'flex', justifyContent: 'space-between'}}>
                        <span className={styles.msgMeta}>{msg.sender.Name}</span>
                    </div>
                    <p className={styles.msgText}>{msg.message}</p>
                    <br />
                </div>
            ))}

            <button className={styles.log} onClick={() => handleOnClick()}>
                Join
            </button>
        </div>
        
    );

};

export default Messages;