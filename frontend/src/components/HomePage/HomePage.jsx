import './HomePage.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import * as workoutActions from '../../store/workout';


function HomePage() {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const currentWorkout = useSelector((state) => state.workouts.currentWorkout);
    const workouts = useSelector((state) => state.workouts.workouts);

    useEffect(() => {
        const getData = async () => {
            await dispatch(workoutActions.fetchAllWorkouts());
            await dispatch(workoutActions.findCurrentWorkout());
        }
        getData();
    }, [dispatch])

    return (
    <div className='home-page-container'>
        <div className='home-page'>
            <div className='home-page-content-div'>
                <h1>Welcome, {user?.username}</h1>
                <p><span className='bold-data'>{workouts.length}</span> {workouts.length === 1 ? 'workout' : 'workouts'} done</p>
                <p># day streak</p>
                <p>Either resume current workout or create a new one</p>
                <p>Log your weight today if you haven't already</p>
            </div>

        </div>
    </div>

    )
}

export default HomePage;
