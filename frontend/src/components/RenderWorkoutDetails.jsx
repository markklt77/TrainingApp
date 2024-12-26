import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExerciseForm from "./CreateExerciseForm/CreateExerciseForm";
import * as workoutActions from "../store/workout"
import * as exerciseActions from "../store/exercise";
import CreateSetForm from "./CreateSetForm/CreateSetForm";

function RenderWorkoutDetails( { workoutId } ) {

    const [showExerciseForm, setShowExerciseForm] = useState(false);
    const [showSetFormForExercise, setShowSetFormForExercise] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const dispatch = useDispatch();
    const workout = useSelector((state) => state.workouts.workout)

    const toggleExerciseForm = () => {
        setShowExerciseForm((prevState) => !prevState);
    };

    const toggleSetForm = () => {
        setShowSetFormForExercise((prevState) => !prevState);
    }



    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await dispatch(workoutActions.findWorkoutById(workoutId));
                setFetchError(false);
            } catch (error) {
                setFetchError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch, workoutId]);


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
            <button>Delete Workout</button>
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
                                                <button onClick={async () => await dispatch(exerciseActions.deleteSetFromExercise(workoutId, exercise.id, set.id))}>delete set</button>
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No sets added for this exercise yet.</p>
                            )}
                             <button onClick={() => toggleSetForm()}>
                                {showSetFormForExercise ? "Cancel" : "Add Set"}
                            </button>
                            {showSetFormForExercise &&
                                <CreateSetForm
                                    workoutId={workoutId}
                                    exerciseId={exercise.id}
                                    onCloseForm={() => setShowSetFormForExercise(false)}
                            />}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No exercises found for this workout.</p>
            )}

            <button onClick={toggleExerciseForm}>
                {showExerciseForm ? "Cancel" : "Add Exercise"}
            </button>


            {showExerciseForm && <ExerciseForm workoutId={workout.id} />}
        </div>
    );
}





export default RenderWorkoutDetails;
