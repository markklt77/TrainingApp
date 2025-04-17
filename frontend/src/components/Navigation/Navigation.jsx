// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navigation-div container'>
      <div className='nav-top'>
        <h1 className='name-header fitlog'>Fitlog</h1>
        {isLoaded && (
          <div className='profile-button-person'>
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
        <div className='home-page-nav-links'>
          <NavLink to="/home" end className='button-nav-link'>
            {/* <span className='nav-icon'><i className="fas fa-home"></i></span> */}
            <span className='nav-bar-title btn'>Home</span>
          </NavLink>
          <NavLink to='/workouts' end className='button-nav-link'>
            {/*
             */}
            <span className='nav-bar-title btn'>Create Workout</span>
          </NavLink>
          <NavLink to='/workouts/view' end className='button-nav-link'>
            {/* <span className='nav-icon'><i className="fas fa-eye"></i></span> */}
            <span className='nav-bar-title btn'>View Workouts</span>
          </NavLink>
          <NavLink to='/workouts/current' end className='button-nav-link'>
            {/* <span className='nav-icon'><i className="fas fa-running"></i></span> */}
            <span className='nav-bar-title btn'>Current Workout</span>
          </NavLink>
          <NavLink to='/weightLog' end className='button-nav-link'>
            {/* <span className='nav-icon'><i className="fas fa-weight-scale"></i></span> */}
            <span className='nav-bar-title btn'>WeightLog</span>
          </NavLink>
        </div>
    </div>
  );
}

export default Navigation;
