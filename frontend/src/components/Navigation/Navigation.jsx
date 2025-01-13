// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navigation-div'>
      <div className='home-logo'>
        <NavLink to="/home"> <img src="/fitlog_icon.png" alt="icon" className='navigation-logo-image'/></NavLink>
      </div>
      {isLoaded && (
        <div className='profile-button-person'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;
