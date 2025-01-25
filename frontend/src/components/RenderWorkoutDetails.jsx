import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as workoutActions from "../store/workout"
import OpenModalButton from "./OpenModalButton";
import SetCurrentConfirmation from "./setCurrentConfirmation";
import EditWorkoutDetails from "./EditWorkoutDetails";
import './RenderWorkoutDetails.css';
import DeleteModal from "../DeleteModal";
// import { useNavigate } from "react-router-dom";

function RenderWorkoutDetails( { workoutId } ) {

    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showEditDetails, setShowEditDetails] = useState(false);
    const dispatch = useDispatch();
    // const navigate = useNavigate();
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
            await dispatch(workoutActions.findMostRecentWorkout())
            await dispatch(workoutActions.fetchAllWorkouts())

        } catch (error) {
            setSuccessMessage("Something went wrong")
            setTimeout(() => {
                setSuccessMessage("");
              }, 3000);
        }
    };

    // const navigateCurrent = async () => {
    //     navigate('workouts/current');
    // }

    const toggleEditDetails = () => {
        setShowEditDetails((prevState) => !prevState);
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

            {successMessage && (
                <div className="delete-success-message">{successMessage}</div>
            )}

            <div className="render-details-header-div">
                <h3 className="render-details-header">Workout Details</h3>
                <div className="editor-set-current-buttons">
                    <div
                        className="open-modal-button-div"
                        onClick={toggleEditDetails}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="edit-pencil">
                            <i className="fas fa-pencil-alt"></i>
                        </span>
                    </div>
                    <OpenModalButton modalComponent={<SetCurrentConfirmation action={workoutActions.setWorkoutasCurrent} entityId={workoutId} finish={true}/>} buttonText={<i class="fas fa-running"></i>} cName={'set-current-button'}></OpenModalButton>
                    {/* <button className="set-current-button" onClick={handleSetCurrent}><span><i class="fas fa-running"></i></span></button> */}
                </div>



                    {showEditDetails && (
                        <div className="edit-workout-details">
                            <EditWorkoutDetails workoutId={workoutId} isModal={true} />
                            <button className='close-editor-button' onClick={toggleEditDetails}>Close Editor</button>
                        </div>
                    )}
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
                        <li className='exercise-list-item' key={exercise.id}>
                            <p>
                                <strong>Exercise:</strong>{" "}
                                {exercise.ExerciseType ? (
                                    exercise.ExerciseType.name
                                ) : (
                                    <span>Loading Exercise Name...</span>
                                )}
                            </p>
                            <h4>Sets</h4>
                            {exercise.ExerciseSets && exercise.ExerciseSets.length > 0 ? (
                                <ul>
                                    {exercise.ExerciseSets.map((set, index) => (
                                        <li key={set.id || index}>
                                            <p>
                                                {/* <strong>Set {index + 1}:</strong>{" "} */}
                                                {set.sets} {set.sets > 1 ? "sets" : "set"} x {set.reps}  {set.reps > 1 ? "reps" : "rep"} @{" "}
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
                <OpenModalButton modalComponent={<DeleteModal entityType={'Workout'} deleteAction={handleDelete}/>} buttonText={<i className="fas fa-trash"></i>} cName={'delete-icon'}/>
            </div>
        </div>
    );
}





export default RenderWorkoutDetails;
