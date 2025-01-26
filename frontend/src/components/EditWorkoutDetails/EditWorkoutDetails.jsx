

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExerciseForm from "../CreateExerciseForm";
import * as workoutActions from "../../store/workout";
import * as exerciseActions from "../../store/exercise";
import CreateSetForm from "../CreateSetForm";
import EditWorkoutForm from "../EditWorkoutForm";
import './EditWorkoutDetails.css';
import OpenModalButton from "../OpenModalButton";
import DeleteModal from "../../DeleteModal";
// import { Link } from "react-router-dom";

function EditWorkoutDetails({ workoutId, isModal }) {
  const [showPreviousStats, setShowPreviousStats] = useState(false);
  const [showSetFormForExercise, setShowSetFormForExercise] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [previousStats, setPreviousStats] = useState({});
  const dispatch = useDispatch();
  const workout = useSelector((state) => state.workouts.workout);

  const filteredWorkouts = useSelector((state) => state.workouts.filteredWorkouts)

  const [previousWorkout, setPreviousWorkout] = useState()

  // This will track the edit mode for each exercise
  const [exerciseEditModes, setExerciseEditModes] = useState({});

  const toggleShowPreviousStats = () => {
    setShowPreviousStats((prev) => !prev)
  }

  const toggleSetForm = (exerciseId) => {
    setShowSetFormForExercise((prevState) => ({
      ...prevState,
      [exerciseId]: !prevState[exerciseId],
    }));
  };

  // Toggle edit mode for a specific exercise
  const toggleExerciseEditMode = (exerciseId) => {
    setExerciseEditModes((prevState) => ({
      ...prevState,
      [exerciseId]: !prevState[exerciseId],
    }));
  };

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

  useEffect(() => {
    // if (!loading && workout?.Exercises?.length > 0) {
      const fetchStats = async () => {
        await dispatch(workoutActions.findWorkoutsByFocus(workout.WorkoutType.focus))

        if (filteredWorkouts && filteredWorkouts.length > 1) {
            setPreviousWorkout(filteredWorkouts[1]);
        }

        const stats = {};
        for (const exercise of workout.Exercises) {
          const exerciseTypeId = exercise.exerciseTypeId;
          const exercises = await dispatch(exerciseActions.getExercisesFromType(exerciseTypeId));

          if (exercises.length > 1) {
            stats[exerciseTypeId] = exercises[1];
          }
        }

        setPreviousStats(stats);
      };

      fetchStats();

    // }
  }, [workout, loading, dispatch, filteredWorkouts]);

  if (loading) {
    return <p>Loading workout details...</p>;
  }

  if (fetchError) {
    // dispatch(workoutActions.setCurrentWorkout(null));
    return <p>Error loading workout details. Please try again later.</p>;
  }

  if (!workout) {
    return <p>No workout found with the given ID.</p>;
  }


  //temporary handleDelete
  const handleDelete = async () => {
        await dispatch(workoutActions.deleteWorkout(workoutId));
        if (workout.current) {
            dispatch(workoutActions.setCurrentWorkout(null))
        }
        await dispatch(workoutActions.findMostRecentWorkout());
        await dispatch(workoutActions.fetchAllWorkouts());
};

  return (
    <div className="edit-details-link div">
      {/* <div className="edit-details-link-div">
        {!isModal &&  <Link to="/home" className="back-button">Back to Dashboard</Link>}
      </div> */}
      <div className={`${isModal? '' : 'current-and-previous-details-div'}`}>
          <div className="workout-details">
          <h3 className='render-details-header'>Workout Details</h3>
          <div>
              <strong>Focus:</strong>
              <EditWorkoutForm workoutId={workoutId} currentFocus={workout.workoutTypeId} />
          </div>
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
                  <li className='exercise-list-item-li' key={exercise.id}>
                  <div className="exercise-header-div">
                      <strong>Exercise:</strong>{" "}
                      <div className="exercise-name-div">
                          {exercise.ExerciseType ? (
                          exercise.ExerciseType.name
                          ) : (
                          <span>Loading Exercise Name...</span>
                          )}
                          <button className="edit-pencil-editor" onClick={() => toggleExerciseEditMode(exercise.id)}>
                          {exerciseEditModes[exercise.id] ? <i className="fas fa-minus"></i> : <i className="fas fa-pencil-alt"></i>}
                          </button>
                      </div>
                  </div>

                  {/* Sets for the Exercise */}
                  <h5>Sets</h5>
                  {exercise.ExerciseSets && exercise.ExerciseSets.length > 0 ? (
                      <ul>
                      {exercise.ExerciseSets.map((set, index) => (
                          <li className="set-list" key={set.id || index}>
                              <span className="set-span">
                                  {/* <strong> Set {index + 1}:</strong>  */}
                                  {set.sets} {set.sets > 1 ? "sets" : "set"} x {set.reps}  {set.reps > 1 ? "reps" : "rep"} @{" "}
                                  {set.weight} lbs
                              </span>
                              {exerciseEditModes[exercise.id] && (

                                  // <button
                                  // className="set-trash-button"
                                  // onClick={async () =>
                                  //     await dispatch(
                                  //     exerciseActions.deleteSetFromExercise(workoutId, exercise.id, set.id)
                                  //     )
                                  // }
                                  // >
                                  // <i className="fas fa-trash"></i>
                                  // </button>
                                  <OpenModalButton modalComponent={<DeleteModal entityIds={{workoutId: workoutId, exerciseId: exercise.id, setId: set.id}} entityType={"Set"} deleteAction={exerciseActions.deleteSetFromExercise}/>} buttonText={<i className="fas fa-trash"></i>} cName={"set-trash-button"}/>

                              )}
                          </li>
                      ))}
                      </ul>
                  ) : (
                      <p>No sets added for this exercise yet.</p>
                  )}

                  {/* Edit Mode Buttons for Each Exercise */}
                  {exerciseEditModes[exercise.id] && (
                      <>
                      {/* <button
                          className="editor-button-delete"
                          onClick={async () =>
                          await dispatch(exerciseActions.deleteExerciseFromWorkout(workoutId, exercise.id))
                          }
                      >
                          Delete Exercise
                      </button> */}
                      <OpenModalButton modalComponent={<DeleteModal entityIds={{workoutId: workoutId, exerciseId: exercise.id}} entityType={'Exercise'} deleteAction={exerciseActions.deleteExerciseFromWorkout}/>} buttonText={'Delete Exercise'} cName={'editor-button-delete'}/>

                      <button className="editor-button" onClick={() => toggleSetForm(exercise.id)}>
                          {showSetFormForExercise[exercise.id] ? "Cancel" : "Add Set"}
                      </button>

                      {showSetFormForExercise[exercise.id] && (
                          <CreateSetForm
                          workoutId={workoutId}
                          exerciseId={exercise.id}
                          onCloseForm={() => toggleSetForm(exercise.id)}
                          />
                      )}
                      </>
                  )}


                  </li>
              ))}
              </ul>
          ) : (
              <p>No exercises found for this workout.</p>
          )}

          <ExerciseForm workoutId={workout.id} />

          {!isModal &&
            <div className="current-workout-delete-workout-button-div">
                  <OpenModalButton modalComponent={<DeleteModal entityType={'Workout'} deleteAction={handleDelete}/>} buttonText={<i className="fas fa-trash"></i>} cName={'delete-icon'}/>
            </div>}

          {/* <button className='editor-button' onClick={toggleExerciseForm}>
              {showExerciseForm ? "Cancel" : "Add Exercise"}
          </button> */}

          </div>
          {!isModal &&
          <div className="previous-stats">
          <h3>Previous Stats</h3>
          <div className="toggle-previous-button-div">
            <button className='editor-button' onClick={toggleShowPreviousStats}>
              {showPreviousStats ?  "Show Workout Stats" : "Show Exercise Stats"}
            </button>
          </div>

          {showPreviousStats ? (

            Object.keys(previousStats).length > 0 ? (
              <ul>
                {Object.entries(previousStats).map(([exerciseTypeId, exercises]) => (
                  <li key={exerciseTypeId}>
                    <div>
                      <strong>Exercise:</strong> {exercises?.ExerciseType?.name || "Error Loading Exercise"}
                    </div>

                    <h4>Sets</h4>
                    {exercises?.ExerciseSets && exercises.ExerciseSets.length > 0 ? (
                      <ul>
                        {exercises.ExerciseSets.map((set, index) => (
                          <li key={set.id || index}>
                            <p>
                              {/* <strong> Set {index + 1}:</strong>  */}
                              {set.sets} {set.sets > 1 ? "sets" : "set"} x {set.reps}  {set.reps > 1 ? "reps" : "rep"} @{" "}
                              {set.weight} lbs
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No sets recorded for this exercise.</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Add an exercise to see previous stats.</p>
            )
          ) : previousWorkout? (
              <div className="workout-details">
              <h3>Workout Details</h3>
              <p>
                  <strong>Focus:</strong> {previousWorkout.WorkoutType?.focus}
              </p>
              <p>
                  <strong>Date:</strong>{" "}
                  {previousWorkout.createdAt
                      ? new Date(previousWorkout.createdAt).toLocaleDateString()
                      : "N/A"}
              </p>

              <h4>Exercises</h4>
              {previousWorkout.Exercises && previousWorkout.Exercises.length > 0 ? (
                  <ul>
                      {previousWorkout.Exercises.map((exercise) => (
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
                                                  {/* <strong> {index + 1}:</strong>{" "} */}
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
          </div>
          ) : (
              <p>No previous workout data available.</p>
          )}
        </div>
          }

      </div>
    </div>
  );
}

export default EditWorkoutDetails;
