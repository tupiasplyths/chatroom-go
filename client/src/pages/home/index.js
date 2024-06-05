import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useCookies from 'react-cookie';

const Home = ({ onUsernameChange}) => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['chatroom_session']);
    const joinChat = () => {
        navigate('/chat', { replace:true });
    };

    const handleUsernameChange = (username) => {
        onUsernameChange(username);
    }

    useEffect(() => {
        if (!cookies.chatroom_session) {
            console.log("no cookies");
        }
        if (!cookies.chatroom_session.authenticated) {
            console.log("not authenticated");
            navigate('/', { replace:true });
        }
        // if (localStorage.getItem('username')) {
        //     navigate('/chat', { replace:true });
        // }
    }, []);

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