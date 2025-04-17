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
                <div className="section no-current-workout-div">
                    <h2 className="view-header">No Current Workout</h2>
                    <p className="information-text">You do not have an in-progress workout</p>
                    <NavLink to='/workouts' className='create-workout-link btn'>Create a Workout</NavLink>
                </div>

        );
    }

    return (

            <div className="section current-details-div">
                <h1 className="view-header">Current Workout</h1>
                <EditWorkoutDetails workoutId={currentWorkout?.id} isModal={false}/>
                <OpenModalButton cName='finish-workout-button' buttonText="Finish Workout" modalComponent={<SetCurrentConfirmation entityId={currentWorkout.id} finish={false} action={workoutActions.finishCurrentWorkout}/>}/>
            </div>

    )
}

export default CurrentWorkoutPage
