import { useRef } from "react";
import styles from './styles.module.css';

const Signup = () => {
    const username = useRef('');
    const password = useRef('');

    const handleSubmit = (e) => {
        e.preventDefault();

    }

    return (
        <div className={styles.body}>
            <link href="https://fonts.googleapis.com/css2?family=Jost:wght@500&display=swap" rel="stylesheet"></link>
            <div className={styles.main}>  	
                <input type="checkbox" id={styles.chk} aria-hidden="true"/>

                <div className={styles.signup}>
                    <form>
                        <label for={styles.chk} aria-hidden="true">Sign up</label>
                        <br></br><br/>
                        <input type="text" name="txt" placeholder="User name" required=""/>
                        <input type="email" name="email" placeholder="Email" required=""/>
                        <input type="password" name="pswd" placeholder="Password" required=""/>
                        <button>Sign up</button>
                    </form>
                </div>

                <div className={styles.login}>
                    <form>
                        <label for={styles.chk} aria-hidden="true">Login</label>
                        <br></br><br/>
                        <input type="email" name="email" placeholder="Email" required=""/>
                        <input type="password" name="pswd" placeholder="Password" required=""/>
                        <button>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;