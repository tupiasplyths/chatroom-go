import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

const Home = ({ username, onUsernameChange, setUsername}) => {
    const navigate = useNavigate();
    const joinChat = (username) => {
        navigate('/chat', { replace:true });
    };

    const handleUsernameChange = (username) => {
        onUsernameChange(username);
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1>{`<>DevRooms</>`}</h1>
                <input className={styles.input} placeholder='Username' onChange={(e) => handleUsernameChange(e.target.value)}/>

                <button 
                    className='btn btn-secondary' style={{ width: '100%' }}
                    onClick={(e) => joinChat(e.target.value)}
                >
                    Join Chat
                </button>

                <p>Sign up <a href='/signup'>here</a> first</p>
            </div>
        </div>
    );
};

export default Home;