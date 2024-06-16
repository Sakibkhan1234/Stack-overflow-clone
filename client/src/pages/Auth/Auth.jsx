import React, { useState } from 'react'
import icon from '../../assest/icon.png'
import AboutAuth from './AboutAuth'
import { useNavigate } from 'react-router-dom'
import { useDispatch} from 'react-redux'
import { signup, login } from "../../actions/auth"

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSwitch = () => {
    setIsSignup(!isSignup);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email && !password) {
      alert("Enter email and password");
    }
    if (isSignup) {
      if (!name) {
        alert("Enter a name to continue");
      }
      dispatch(signup({ name, email, password }, navigate));
    } else {
      dispatch(login({ email, password }, navigate));
    }
  };
    
  return (
    <section className="auth-section">
    {isSignup && <AboutAuth />}
    <div className="auth-container-2">
      <img src={icon} alt="stack overflow" className="login-logo" />
      <form onSubmit={handleSubmit}>
        {isSignup && 
        (  
          <label htmlFor="name">
            <h5>Display Name</h5>
            <br />
            <input type="text" id="name" name="name" value={name} onChange={(e) => {setName(e.target.value);}}/>
            <br />
          </label>
        )}
        <label htmlFor="email">
          <h5>Email</h5>
          <br />
          <input type="email" name="email" id="email" value={email} onChange={(e) => {setEmail(e.target.value);}}/>
          <br />
        </label>
        <label htmlFor="password">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5>Password</h5>
            {!isSignup && (
              <p style={{ color: "#007ac6", fontSize: "13px" }}>
                forgot password?
              </p>
            )}
          </div>
          <br />
          <input type="password" name="password" id="password" value={password} onChange={(e) => {setPassword(e.target.value);}}/>
        </label>
        <br />
        <button type="submit" className="auth-btn">
          {isSignup ? "Sign up" : "Log in"}
        </button>
        <br />
      </form>
      <p>
        {isSignup ? "Already have an account?" : "Don't have an account?"}
        <button type="button" className="handle-switch-btn" onClick={handleSwitch}>
          {isSignup ? "Log in" : "sign up"}
        </button>
      </p>
    </div>
  </section>
);
}

export default Auth


