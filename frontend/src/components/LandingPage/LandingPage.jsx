import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import SignupFormPage from '../SignupFormPage';

function LandingPage() {
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false)
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

  const togglePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
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
    <div className='container'>
        <div className='landing-page-nav-bar'>
            <h2 className='name-header fitlog'>Fitlog</h2>
            <div className='landing-page-menu'>
                <button className='landing-page-menu-button btn' onClick={() => setIsPage('Home')}>Home</button>
                <button className='landing-page-menu-button btn' onClick={() => setIsPage('LogIn')}>Login</button>
                <button className='landing-page-menu-button btn' onClick={() => setIsPage('SignUp')}>Sign Up</button>
            </div>
        </div>
        <div className='landing-page-main'>
            {isPage === 'Home' && (
                <div className='description-content-holder'>
                    <h1 className='discover'>Discover Fitlog: <span className='description-paragraph'>Effortlessly create and manage your workout
                    routines, monitor <strong className='progress-span'>your progress</strong>, and keep a record of your weight changes.</span></h1>
                    {/* <p className='description-paragraph'>Welcome to Fitog, your go-to solution for tracking your gym progress.
                    With our user-friendly interface, you can effortlessly create and manage your workout
                    routines, monitor your progress, and keep a record of your weight changes.
                    </p> */}
                    <div className='sign-up-demo-div'>
                        <button className='btn' onClick={() => setIsPage('SignUp')}>Sign Up to Get Tracking!</button>
                        <p className='home-page-or'>or</p>
                        <button className='btn' onClick={loginDemoUser}>Try it as a Demo User!</button>
                    </div>

                </div>
            )}
            {isPage === 'LogIn' && (
            <div className="landing-page-container">
                <form onSubmit={handleSubmit} className="landing-form">
                    <h2 className="name-header">Member Login</h2>
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
                    </div>
                    <div className="input-container">

                    <input
                        className='landing-page-input'
                        type={passwordVisible? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label className='landing-page-label'>
                        Password
                    </label>
                    {passwordVisible? (
                        <button className='password-toggle-btn' onClick={(e) => {
                            e.preventDefault();
                            togglePasswordVisible();}}>
                        <span className='key'><i class="fas fa-eye"></i></span></button>
                    ) : (
                        <button className='password-toggle-btn' onClick={(e) => {
                            e.preventDefault();
                            togglePasswordVisible();}}>
                        <span className='key'><i class="fas fa-eye-slash"></i></span></button>
                    )}
                    {errors.credential && (
                    <p className='landing-page-error'>{errors.credential}</p>
                    )}
                    </div>
                        <button className='btn log-in-btn' type="submit">Log In</button>

                </form>
                <div className='no-account'>
                    <p className='form-text'>Don&#39;t have an account?</p>
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
            <div className='side-image-div'>
                <img  className='side-image' src='/Fitlog_site_background_home_page.png'></img>
            </div>
        </div>
    </div>
  );
}

export default LandingPage;
