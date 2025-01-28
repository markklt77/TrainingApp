import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import SignupFormPage from '../SignupFormPage';

function LandingPage() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()
  const [isPage, setIsPage] = useState('Home')

  const loginDemoUser = async () => {
    dispatch(sessionActions.login({credential: 'demo@user.io', password: 'password'}))
    .then(() => {
        navigate('/home')
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        navigate('/home')
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  return (
    <div className='everything-landing-page-holder'>
        <div className='landing-page-nav-bar'>
            <div className='landing-page-menu'>
                <button className='landing-page-menu-button' onClick={() => setIsPage('Home')}>Home</button>
                <button className='landing-page-menu-button' onClick={() => setIsPage('LogIn')}>Login</button>
                <button className='landing-page-menu-button' onClick={() => setIsPage('SignUp')}>Sign Up</button>
            </div>
        </div>
        <div className='left-right-landing-page'>
            {isPage === 'Home' && (
                <div className='main-description-div'>
                    <div className='description-content-holder'>
                        <h1 className='discover'>Discover Fitlog:Your Ultimate Gym Progress Tracker</h1>
                        <p className='description-paragraph'>Welcome to Fitog, your go-to solution for tracking your gym progress.
                        With our user-friendly interface, you can effortlessly create and manage your workout
                        routines, monitor your progress, and keep a record of your weight changes.
                        </p>
                        <div className='sign-up-demo-div'>
                            <button className='main-sign-up-button' onClick={() => setIsPage('SignUp')}>Sign Up to Get Tracking!</button>
                            <p className='home-page-or'>or</p>
                            <button className='main-sign-up-button' onClick={loginDemoUser}>Try it as a Demo User!</button>
                        </div>

                    </div>

                </div>
            )}
            {isPage === 'LogIn' && (
            <div className="landing-page-container">
                <div className='landing-page-header'>
                    <div className='fit-log-image-div'>
                        <img src="/fitlog_icon.png" alt="icon" className='fit-log-image'/>
                    </div>
                    <h2 className="name-header">FitLog</h2>
                </div>
                <form onSubmit={handleSubmit} className="landing-form">
                    <div className="input-container">
                    <input
                        className='landing-page-input'
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                    <label className='landing-page-label'>
                        Username or Email
                    </label>
                    <span className='envelope'><i className="fa fa-envelope"></i></span>
                    </div>
                    <div className="input-container">

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
                    {errors.credential && (
                    <p className='landing-page-error'>{errors.credential}</p>
                    )}
                    </div>


                        <button className='log-in-button' type="submit">Log In</button>

                </form>
                <div className='no-account'>
                    <span className='form-text'>Don&#39;t have an account?</span>
                    <button className='switch-to-sign-up' onClick={() => setIsPage('SignUp')}>Sign Up</button>
                </div>
            </div>
            )}
            {isPage ==='SignUp' && (
            <div className='sign-up-form-div'>
                {isPage === 'SignUp' && <SignupFormPage/>}
                {isPage === 'SignUp' && (
                <div className='no-account'>
                    <span className='form-text'>Already have an account?</span>
                    <button className='switch-to-sign-up' onClick={() => setIsPage('LogIn')}>Log In</button>
                </div>)}
            </div>
            )}
            <div className='landing-page-right'>
                <div className='landing-page-picture-div'>
                    <img src="/New_Landing_Page_image.PNG" alt="icon" className='side-image'/>
                </div>
            </div>

        </div>
    </div>
  );
}

export default LandingPage;
