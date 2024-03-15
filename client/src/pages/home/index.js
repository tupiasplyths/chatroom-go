import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

const Home = ({ username, room, onUsernameChange, onRoomNameChange, setUsername}) => {
    const navigate = useNavigate();
    const joinRoom = () => {
        // if (room !== '' && username !== '') {
        //     socket.send(JSON.stringify({ action: 'join-room', message: room }));
        // }
        // setUsername(document.getElementById('username').value);
        navigate('/chat', { replace:true });
    };

    const handleUsernameChange = (username) => {
        onUsernameChange(username);
    }
    const handleRoomNameChange = (room) => {
        onRoomNameChange(room);
    }
   

    return (
        <div className={styles.container}>
        <div className={styles.formContainer}>
            <h1>{`<>DevRooms</>`}</h1>
            <input className={styles.input} placeholder='Username' onChange={(e) => handleUsernameChange(e.target.value)}/>

            <select className={styles.input}
            onChange={(e) => handleRoomNameChange(e.target.value)}
            >
            <option>-- Select Room --</option>
            <option value='javascript'>JavaScript</option>
            <option value='node'>Node</option>
            <option value='express'>Express</option>
            <option value='react'>React</option>
            </select>

            <button className='btn btn-secondary' style={{ width: '100%' }}
                onClick={joinRoom}
            >Join Room</button>
        </div>
        </div>
    );
};

export default Home;