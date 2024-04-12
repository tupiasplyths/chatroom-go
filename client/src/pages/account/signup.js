import { createRef, useRef, useState } from "react";
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    //TODO: notif when signup and login
    const navigate = useNavigate();
    const username = useRef('');
    const loginPassword = useRef('');
    const [password, setPassword] = useState('');
    const email = useRef('');
    const power = createRef();
    const handleLogin = (e) => {
        e.preventDefault();
        let check = false;
        fetch("http://localhost:3789/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.current,
                password: loginPassword.current
            })
        }).then((res) => res.json()).then((data) => {
            console.log(data.message + " " + typeof(data.message));
            if (data.message === 'login success') {
                check = true;
            }
            console.log("check is " + check)
            if (check) {
                navigate('/', { replace: true });
            }
        }).catch((err) => console.log(err));
    }

    const handleSignup = (e) => {
        e.preventDefault();

        fetch("http://localhost:3789/signup", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.current,
                password: password,
                email: email.current
            })
        }).then((res) => res.json()).then((data) => {
            console.log(data);
        }).catch((err) => console.log(err));
    }
    const passwordStrengthCheck = (e) => {
        setPassword(e.target.value);let pwd = e.target.value
        let point = 0;
        let widthPower = ["1%", "25%", "50%", "75%", "100%"]; 
        let colorPower = ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"]; 
        
        if (pwd.length > 7) {
            let arrayTest = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/]; 
            arrayTest.forEach((item) => { 
                if (item.test(pwd)) { 
                    point += 1; 
                } 
            }); 
        }
        
        power.current.style.width = widthPower[point]; 
        power.current.style.backgroundColor = colorPower[point]; 
        console.log("width should be " + widthPower[point]);
    }

    return (
        <div className={styles.body}>
            <link href="https://fonts.googleapis.com/css2?family=Jost:wght@500&display=swap" rel="stylesheet"></link>
            <div className={styles.main}>  	
                <input type="checkbox" id={styles.chk} aria-hidden="true"/>

                <div className={styles.signup}>
                    <form onSubmit={handleSignup}>
                        <label htmlFor={styles.chk} aria-hidden="true">Sign up</label>
                        <br></br><br/>
                        <input type="text" name="txt" placeholder="Username" required onChange={(e) => username.current = e.target.value}/>
                        <input type="email" name="email" placeholder="Email" required onChange={(e) => email.current = e.target.value}/>
                        <input 
                            type="password" name="pswd" 
                            placeholder="Password" required 
                            onInput={passwordStrengthCheck}
                            value={password}
                        />
                        <div className={styles.powercontainer}>
                            <div className={styles.powerpoint} ref={power}></div>
                        </div>
                        <button>Sign up</button>
                    </form>
                </div>

                <div className={styles.login}>
                    <form onSubmit={handleLogin}>
                        <label htmlFor={styles.chk} aria-hidden="true">Login</label>
                        <br></br><br/>
                        <input type="text" name="username" placeholder="Username" required onChange={(e) => username.current = e.target.value}/>
                        <input type="password" name="pswd" placeholder="Password" required onChange={(e) => loginPassword.current = e.target.value}/>
                        <button>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;