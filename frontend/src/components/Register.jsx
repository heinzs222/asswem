import "./register.css";
import logo from "./logo.png";
export default function Register() {
    return (
        <div className="registerContainer">
            <div className="logo">
                <img src={logo} alt="logo" width="100px" height="100px" />
                REGISTER
            </div>
            <form>
                <input type="text" placeholder="username" />
                <input type="email" placeholder="email" />
                <input type="pass" placeholder="password" />
                <button className="registerBtn">Register</button>
                <span className="success">Suuccessful. You can now Login</span>
                <span className="failure">Please check your credentials</span>
            </form>
        </div>
    );
}
