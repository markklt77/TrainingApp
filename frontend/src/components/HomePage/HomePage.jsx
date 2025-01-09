import './HomePage.css';
import HomePageButton from '../HomePageButton';
import { FaDumbbell } from 'react-icons/fa';



function HomePage() {
    return (
    <>
        <h2>Dashboard</h2>
        <div className='home-page'>
            <div className="home-page-button-container">
                <HomePageButton path="/workouts" title="Create Workout" icon={ <FaDumbbell/> }/>
                <HomePageButton path="/workouts/view" title="View Workouts"/>
                <HomePageButton path="workouts/current" title="Current Workout"/>
            </div>
        </div>
    </>

    )
}

export default HomePage;
