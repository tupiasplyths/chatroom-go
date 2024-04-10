import { createRef, useRef, useState } from "react";
import styles from './styles.module.css';

const Signup = () => {
    const username = useRef('');
    // const password = useRef('');
    const [password, setPassword] = useState('');
    const email = useRef('');
    const power = createRef();
    const [color, setColor] = useState('');
    const [width, setWidth] = useState(''); 
    const handleLogin = (e) => {
        e.preventDefault();

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
        }).then((res) => {
            if (res.status !== 200) {
            }   
            console.log(res);
            
        })
    }
    const passwordStrengthCheck = (e) => {
        setPassword(e.target.value);
        // console.log("current length " + password.length + " actual text " + password + "\n vs text received: " + e.target.value)
        let pwd = e.target.value
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
        setColor(colorPower[point]);
        setWidth(widthPower[point]);
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
                            // onChange={(e) => {
                            //     // setPassword(e.target.value)
                            //     passwordStrengthCheck(e);
                            // }}
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
                        <input type="password" name="pswd" placeholder="Password" required onChange={(e) => password.current = e.target.value}/>
                        {/* <Password className={styles.password} value={password} onChange={(e) => setPassword(e.target.value)} /> */}
                        <button>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;