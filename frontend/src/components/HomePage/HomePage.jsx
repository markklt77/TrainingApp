import './HomePage.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import * as workoutActions from '../../store/workout';
import { NavLink } from 'react-router-dom';


function HomePage() {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const currentWorkout = useSelector((state) => state.workouts.currentWorkout);
    const workouts = useSelector((state) => state.workouts.workouts);
    const weights = useSelector((state) => state.weights.weights);

    useEffect(() => {
        const getData = async () => {
            await dispatch(workoutActions.fetchAllWorkouts());
            await dispatch(workoutActions.findCurrentWorkout());
        }
        getData();
    }, [dispatch])

    const today = new Date().toISOString().split('T')[0];
    const hasWorkoutToday = workouts.some((workout) => {
        const workoutDate = new Date(workout.createdAt).toISOString().split('T')[0];
        return workoutDate === today;
    });

    const hasWeightToday = weights.some((weight) => {
        const weightDate = new Date(weight.createdAt).toISOString().split('T')[0];
        return weightDate === today;
    })

    return (
    <div className='home-page-container'>
        <div className='home-page'>
            <div className='home-page-content-div'>
                <h1>Welcome, {user?.username}</h1>
                <p className='workouts-done'> 💪 Total Workouts: <span className='bold-data'>{workouts.length}</span></p>
                {/* <p className='streak'><span className='fire-emote'><i className="fa-solid fa-fire"></i></span> Streak: </p> */}
                <h3 className='to-do-header'>To do:</h3>
                <div className="workout-actions">
                    {currentWorkout ? (
                        <div className='home-navlink-div'>
                            <NavLink to={`/workouts/current`} className="home-page-link">
                                Resume Workout
                            </NavLink>
                        </div>
                    ) : hasWorkoutToday ? (
                        <p className='home-success-message'>✅ Today's workout completed!</p>
                    ) : (
                        <div className='home-navlink-div'>
                            <NavLink to="/workouts" className="home-page-link">
                                Create a Workout for Today!
                            </NavLink>
                        </div>
                    )}
                </div>
                <div className='weight-actions'>
                    {!hasWeightToday ? (
                        <div className='home-navlink-div'>
                            <NavLink to='/weightLog' className="home-page-link">
                                Log Your Weight
                            </NavLink>
                            </div>
                    ) : (
                        <p className='home-success-message'>✅ Today's weight logged!</p>
                    )}
                </div>
            </div>

        </div>
    </div>

    )
}

export default HomePage;
