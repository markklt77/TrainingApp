import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as workoutActions from "../../store/workout";
import OpenModalButton from "../OpenModalButton";
import SetCurrentConfirmation from "../SetCurrentConfirmation";
import EditWorkoutDetails from "../EditWorkoutDetails";
import './RenderWorkoutDetails.css';
import DeleteModal from "../../DeleteModal";

function RenderWorkoutDetails( { workoutId } ) {

    //states for dragging edit box
    const [modalPosition, setModalPosition] = useState({ x: 100, y: -100});
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0});

    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showEditDetails, setShowEditDetails] = useState(false);
    const dispatch = useDispatch();
    const workout = useSelector((state) => state.workouts.workoutIds[workoutId])

    //function for dragging edit box

    const handleMouseDown = (e) => {

        if (e.target.tagName === "SELECT" || e.target.closest("select") ||
            e.target.tagName === "INPUT" || e.target. closest("input")) {
            return;
        }

        e.preventDefault();
        setDragging(true);
        setOffset({
            x: e.clientX - modalPosition.x,
            y: e.clientY - modalPosition.y
        });
    }

    const handleMouseMove = (e) => {
        if (dragging) {
            setModalPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        if (dragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging]);


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
            if (workout.current) {
                dispatch(workoutActions.setCurrentWorkout(null))
            }
            await dispatch(workoutActions.findMostRecentWorkout())
            await dispatch(workoutActions.fetchAllWorkouts())

        } catch (error) {
            setSuccessMessage("Something went wrong")
            setTimeout(() => {
                setSuccessMessage("");
              }, 3000);
        }
    };


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
                    <button
                        className="btn pencil"
                        onClick={toggleEditDetails}
                        style={{ cursor: 'pointer' }}
                    >
                    <i className="fas fa-pencil-alt"></i>
                    </button>
                    <OpenModalButton modalComponent={<SetCurrentConfirmation action={workoutActions.setWorkoutasCurrent} entityId={workoutId} finish={true}/>} buttonText={<i className="fas fa-running"></i>} cName={'set-current-button btn'}></OpenModalButton>
                </div>



                    {showEditDetails && (
                        <div
                            className="edit-workout-details"
                            onMouseDown={handleMouseDown}
                            style={{
                                position: "absolute",
                                top: `${modalPosition.y}px`,
                                left: `${modalPosition.x}px`,
                                zIndex: 9999,
                            }}

                        >
                            <EditWorkoutDetails workoutId={workoutId} isModal={true} />
                            <button className='close-editor-button' onClick={toggleEditDetails}>Close Editor</button>
                        </div>
                    )}
            </div>


            <p>
                <strong>Type:</strong> <span className="information-text">{workout.WorkoutType?.focus}</span>
            </p>
            <p>
                <strong>Date:</strong>{" "}
                <span className="information-text">
                {workout.createdAt
                    ? new Date(workout.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
            </p>

            <h4 className="exercise-header">Exercises</h4>
            {workout.Exercises && workout.Exercises.length > 0 ? (
                <ul className="exercise-list">
                    {workout.Exercises.map((exercise) => (
                        <li className='exercise-list-item' key={exercise.id}>
                            <p>
                                <p className="exercise-type">{exercise.ExerciseType ? (
                                    exercise.ExerciseType.name
                                ) : (
                                    <span>Loading Exercise Name...</span>
                                )}</p>
                            </p>
                            {exercise.ExerciseSets && exercise.ExerciseSets.length > 0 ? (
                                <ul className="sets-list">
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
                                <p className="information-text">No sets added for this exercise yet.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <ul className="exercise-list">
                    <li className="information-text">No exercises found for this workout</li>
                </ul>
            )}
            <OpenModalButton modalComponent={<DeleteModal entityType={'Workout'} deleteAction={handleDelete}/>} buttonText={<i className="fas fa-trash"></i>} cName={'delete-icon btn'}/>
        </div>
    );
}





export default RenderWorkoutDetails;
