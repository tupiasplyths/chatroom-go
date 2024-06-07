import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const backend_url = "http://" + process.env.REACT_APP_BACKEND_URL + ":" + process.env.REACT_APP_BACKEND_PORT;

const Home = ({ onUsernameChange}) => {
	const navigate = useNavigate();
	const joinChat = () => {
		navigate('/chat', { replace:true });
	};

	const handleUsernameChange = (username) => {
		onUsernameChange(username);
	}
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

				<p>Sign up <a href='/'>here</a> first</p>
			</div>
		</div>
	);
};

export default Home;