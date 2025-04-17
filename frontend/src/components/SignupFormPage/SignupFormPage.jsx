import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import './SignupFormPage.css'
import { useNavigate } from 'react-router-dom';


function SignupFormPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  }


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
      <form onSubmit={handleSubmit} className="landing-form">
      <h2 className="name-header">Sign Up</h2>
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

        </div>
        {errors.username && <p className='landing-page-error'>{errors.username}</p>}
        <div className='input-container'>
            <input
                className='landing-page-input'
                type= {passwordVisible? 'text' : 'password'}
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
        </div>
        {errors.password && <p className='landing-page-error'>{errors.password}</p>}
        <div className='input-container'>
            <input
                className='landing-page-input'
                type={passwordVisible? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <label className='landing-page-label'>
                Confirm Password
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
        </div>
        {errors.confirmPassword && (
            <p className='landing-page-error'>{errors.confirmPassword}</p>
            )}
        <button className='btn log-in-btn' type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPage;
