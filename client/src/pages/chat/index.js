import styles from './styles.module.css';
import MessagesReceived from './messages';
import { useEffect, useState } from 'react';
import SendMessage from './send-message';

const Chat = ({ username, room }) => {
    // TODO limit websockets to 1 connection
    const [rooms, setRooms] = useState([]);
    
    // const [socket, setSocket] = useState(new WebSocket("ws://localhost:3789/ws?name=" + username));
    // const [socket, setSocket] = useState(null)
    const socket = new WebSocket("ws://localhost:3789/ws?name=" + username);
    useEffect(() => {
        // const tmpSocket = new WebSocket("ws://localhost:3789/ws?name=" + username)
        // setSocket(tmpSocket)
        // setRooms([
            //     ...rooms,
        //     {
        //         name: room,
        //         messages: [],
        //     }
        // ])
        if (socket.readyState !== 1) {
            console.log("socket not ready")
            setTimeout(() => { }, 5000);
        }
        console.log("got username " + username)
        socket.addEventListener('open', (event) => {
            console.log("connected")
        });
        
        

        // return () => socket.close(1000, "closed");
    }, []);

    
    
    return (
        <div className={styles.chatContainer}>
            <div> 
                <MessagesReceived socket={socket} rooms={rooms} room={room} setRooms={setRooms}/>   
                <SendMessage 
                    socket={socket} username={username} room={room} rooms={rooms} setRooms={setRooms}
                />             
            </div>
        </div>
    )
}

export default Chat;