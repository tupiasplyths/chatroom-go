import styles from './styles.module.css';
import React, { useState } from 'react';

const SendMessage = ({ socket, username, room }) => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (message !== '') {
            // const __createdtime__ = Date.now();

            socket.send(JSON.stringify({ action: "send-message", message: message, target: {name: room} }));
            console.log('Message sent: ', message);
            setMessage('');
        }
    };

    return (
        <div className={styles.sendMessageContainer}>
            <input 
                className={styles.sendMessageContainer}
                placeholder='Type a message...'
                onChange={(e) => setMessage(e.target.value)}
                value={message}
            />

            <button className='btn btn-primary' onClick={sendMessage}>
                Send
            </button>
        </div>
    )
}

export default SendMessage;