import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import * as workoutActions from "../../store/workout";
import EditWorkoutDetails from "../EditWorkoutDetails";
import { Link, NavLink } from "react-router-dom";
import './CurrentWorkoutPage.css'
import OpenModalButton from "../OpenModalButton";
import SetCurrentConfirmation from "../SetCurrentConfirmation";

function CurrentWorkoutPage() {
    const dispatch = useDispatch();
    const currentWorkout = useSelector((state) => state.workouts.currentWorkout);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMostRecent = async() => {
            try {
                await dispatch(workoutActions.findCurrentWorkout());
            } catch {
                // await dispatch(workoutActions.setCurrentWorkout(null))
            } finally {
                setIsLoading(false);
            }
        }
        fetchMostRecent();
    }, [dispatch]);


    if (isLoading) {
        return (
            <div className="current-details-div-holder">
                <div className="no-current-workout-div">

                </div>
            </div>

        )

    }

    if (!currentWorkout) {
        return (
            <div className="current-details-div-holder">
                <div className="no-current-workout-div">
                    <h2>No Current Workout</h2>
                    <p className="no-current-text">You do not have an in-progress workout</p>
                    <NavLink to='/workouts' className='create-workout-link'>Create a Workout</NavLink>
                </div>
            </div>
        );
    }

    return (
        <div className="current-details-div-holder">

            <div className="current-details-div">
                <div className="create-workout-link-div">
                    <Link to="/home" className="back-button">Back to Dashboard</Link>
                </div>
                <h1 className="current-workout-header">Current Workout</h1>
                <EditWorkoutDetails workoutId={currentWorkout?.id} isModal={false}/>
                <OpenModalButton cName='finish-workout-button' buttonText="Finish Workout" modalComponent={<SetCurrentConfirmation entityId={currentWorkout.id} finish={false} action={workoutActions.finishCurrentWorkout}/>}/>
            </div>
        </div>

    )
}

export default CurrentWorkoutPage
