import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import './SignupFormPage.css'
import { useNavigate } from 'react-router-dom';


function SignupFormPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          password
        })
      )
        .then(() => navigate('/home'))
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div>
    <div className='landing-page-header'>
        <div className='fit-log-image-div'>
            <img src="/fitlog_icon.png" alt="icon" className='fit-log-image'/>
        </div>
        <h2 className="name-header">FitLog</h2>
    </div>
      {/* <h1>Sign Up</h1> */}
      <form onSubmit={handleSubmit} className="landing-form">
        <div className='input-container'>
            <input
                className='landing-page-input'
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label className='landing-page-label'>
                Email
            </label>
            <span className='envelope'><i className="fa fa-envelope"></i></span>
        </div>
        {errors.email && <p className='landing-page-error'>{errors.email}</p>}
        <div className='input-container'>
            <input
                className='landing-page-input'
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <label className='landing-page-label'>
                Username
            </label>
            <span className='person'><i className="fa fa-user"></i></span>

        </div>
        {errors.username && <p className='landing-page-error'>{errors.username}</p>}
        <div className='input-container'>
            <input
                className='landing-page-input'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <label className='landing-page-label'>
                Password
            </label>
            <span className='key'><i className="fa fa-key"></i></span>
        </div>
        {errors.password && <p className='landing-page-error'>{errors.password}</p>}
        <div className='input-container'>
            <input
                className='landing-page-input'
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <label className='landing-page-label'>
                Confirm Password
            </label>
            <span className='key'><i className="fa fa-key"></i></span>
        </div>
        {errors.confirmPassword && (
            <p className='landing-page-error'>{errors.confirmPassword}</p>
            )}
        <button className='log-in-button' type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPage;
