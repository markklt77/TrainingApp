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
            </div>
        </div>
    </>

    )
}

export default HomePage;
