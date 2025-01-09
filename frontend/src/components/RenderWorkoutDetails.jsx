import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as workoutActions from "../store/workout"
import OpenModalButton from "./OpenModalButton";
import EditWorkoutDetails from "./EditWorkoutDetails";
import { useNavigate } from "react-router-dom";

function RenderWorkoutDetails( { workoutId } ) {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const dispatch = useDispatch();
    const workout = useSelector((state) => state.workouts.workoutIds[workoutId])


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await dispatch(workoutActions.setWorkoutIdinStore(workoutId));
                setFetchError(false);
            } catch (error) {
                setFetchError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch, workoutId]);

    const handleDelete = async () => {
        try {
            await dispatch(workoutActions.deleteWorkout(workoutId));
            alert('Workout successfully deleted');
            navigate('/')
        } catch (error) {
            console.error('Failed to delete workout:', error);
            alert('Failed to delete workout');
        }
    };


    if (loading) {
        return <p>Loading workout details...</p>;
    }

    if (fetchError) {
        return <p>Error loading workout details. Please try again later.</p>;
    }

    if (!workout) {
        return <p>No workout found with the given ID.</p>;
    }


    return (
        <div className="workout-details">
            <h3>Workout Details</h3>

            <div>
                <OpenModalButton modalComponent={<EditWorkoutDetails workoutId={workoutId} isModal={true}/>} buttonText={"Edit Workout"}/>
            </div>

            <p>
                <strong>Focus:</strong> {workout.WorkoutType?.focus}
            </p>
            <p>
                <strong>Date:</strong>{" "}
                {workout.createdAt
                    ? new Date(workout.createdAt).toLocaleDateString()
                    : "N/A"}
            </p>

            <h4>Exercises</h4>
            {workout.Exercises && workout.Exercises.length > 0 ? (
                <ul>
                    {workout.Exercises.map((exercise) => (
                        <li key={exercise.id}>
                            <p>
                                <strong>Exercise:</strong>{" "}
                                {exercise.ExerciseType ? (
                                    exercise.ExerciseType.name
                                ) : (
                                    <span>Loading Exercise Name...</span>
                                )}
                            </p>
                            <h5>Sets</h5>
                            {exercise.ExerciseSets && exercise.ExerciseSets.length > 0 ? (
                                <ul>
                                    {exercise.ExerciseSets.map((set, index) => (
                                        <li key={set.id || index}>
                                            <p>
                                                <strong>Set {index + 1}:</strong>{" "}
                                                {set.sets} sets x {set.reps} reps @{" "}
                                                {set.weight} lbs

                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No sets added for this exercise yet.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No exercises found for this workout.</p>
            )}
            <div>
                <button onClick={handleDelete}>Delete Workout</button>
            </div>
        </div>
    );
}





export default RenderWorkoutDetails;
