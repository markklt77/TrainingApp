// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navigation-div'>
      {/* <div className='home-logo'>

      </div> */}
      <div className='links-person-div'>
        <div className='home-page-nav-links'>
          <NavLink to="/home" end className='button-nav-link'>
            <span className='nav-icon'><i class="fas fa-home"></i></span><span className='nav-bar-title'>Home</span>
          </NavLink>
          <NavLink to='/workouts' end className='button-nav-link'>
            <span className='nav-icon'><i class="fas fa-dumbbell"></i></span><span className='nav-bar-title'>Create Workout</span>
          </NavLink>
          <NavLink to='/workouts/view' end className='button-nav-link'>
            <span className='nav-icon'><i class="fas fa-eye"></i></span><span className='nav-bar-title'>View Workouts</span>
          </NavLink>
          <NavLink to='/workouts/current' end className='button-nav-link'>
            <span className='nav-icon'><i class="fas fa-running"></i></span><span className='nav-bar-title'>Current Workout</span>
          </NavLink>
          <NavLink to='/weightLog' end className='button-nav-link'>
            <span className='nav-icon'><i class="fas fa-weight-scale"></i></span><span className='nav-bar-title'>WeightLog</span>
          </NavLink>
        </div>
        {isLoaded && (
          <div className='profile-button-person'>
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>

    </div>
  );
}

export default Navigation;
