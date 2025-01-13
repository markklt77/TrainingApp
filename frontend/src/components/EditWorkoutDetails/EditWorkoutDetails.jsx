

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExerciseForm from "../CreateExerciseForm";
import * as workoutActions from "../../store/workout";
import * as exerciseActions from "../../store/exercise";
import CreateSetForm from "../CreateSetForm";
import EditWorkoutForm from "../EditWorkoutForm";
import { useModal } from "../../context/Modal";

function EditWorkoutDetails({ workoutId, isModal }) {
  const [showPreviousStats, setShowPreviousStats] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [showSetFormForExercise, setShowSetFormForExercise] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [previousStats, setPreviousStats] = useState({});
  const dispatch = useDispatch();
  const workout = useSelector((state) => state.workouts.workout);
  const previousExercises = useSelector((state) => state.exercises.exercises)
  const filteredWorkouts = useSelector((state) => state.workouts.filteredWorkouts)
  const { closeModal } = useModal();

  const [previousWorkout, setPreviousWorkout] = useState()

  // This will track the edit mode for each exercise
  const [exerciseEditModes, setExerciseEditModes] = useState({});

  const toggleShowPreviousStats = () => {
    setShowPreviousStats((prev) => !prev)
  }

  const toggleExerciseForm = () => {
    setShowExerciseForm((prevState) => !prevState);
  };

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
  }, [workout, loading, dispatch]);

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
    <div>
        <div className="workout-details">
        <h3>Workout Details</h3>
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
                <li key={exercise.id}>
                <div>
                    <strong>Exercise:</strong>{" "}
                    {exercise.ExerciseType ? (
                    exercise.ExerciseType.name
                    ) : (
                    <span>Loading Exercise Name...</span>
                    )}
                </div>

                {/* Sets for the Exercise */}
                <h5>Sets</h5>
                {exercise.ExerciseSets && exercise.ExerciseSets.length > 0 ? (
                    <ul>
                    {exercise.ExerciseSets.map((set, index) => (
                        <li key={set.id || index}>
                        <p>
                            <strong>Set {index + 1}:</strong> {set.sets} sets x {set.reps} reps @{" "}
                            {set.weight} lbs
                        </p>
                        {exerciseEditModes[exercise.id] && (
                            <button
                            onClick={async () =>
                                await dispatch(
                                exerciseActions.deleteSetFromExercise(workoutId, exercise.id, set.id)
                                )
                            }
                            >
                            Delete Set
                            </button>
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
                    <button
                        onClick={async () =>
                        await dispatch(exerciseActions.deleteExerciseFromWorkout(workoutId, exercise.id))
                        }
                    >
                        Delete Exercise
                    </button>

                    <button onClick={() => toggleSetForm(exercise.id)}>
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

                <button onClick={() => toggleExerciseEditMode(exercise.id)}>
                    {exerciseEditModes[exercise.id] ? "Done" : "Edit"}
                </button>
                </li>
            ))}
            </ul>
        ) : (
            <p>No exercises found for this workout.</p>
        )}

        {/* Add Exercise Button */}
        {showExerciseForm && <ExerciseForm workoutId={workout.id} />}

        <button onClick={toggleExerciseForm}>
            {showExerciseForm ? "Cancel" : "Add Exercise"}
        </button>

        {isModal && (
        <div>
            <button onClick={closeModal}>Close</button>
        </div>
        )}
        </div>
        {!isModal &&
        <div className="previous-stats">
        <h4>Previous Stats</h4>
        <button onClick={toggleShowPreviousStats}>
          {showPreviousStats ?  "Show Workout Stats" : "Show Exercise Stats"}
        </button>
        {showPreviousStats ? (
          Object.keys(previousStats).length > 0 ? (  // <-- Removed the extra curly braces
            <ul>
              {Object.entries(previousStats).map(([exerciseTypeId, exercises]) => (
                <li key={exerciseTypeId}>
                  <div>
                    <strong>Exercise:</strong> {exercises?.ExerciseType?.name || "Error Loading Exercise"}
                  </div>

                  <h5>Sets</h5>
                  {exercises?.ExerciseSets && exercises.ExerciseSets.length > 0 ? (
                    <ul>
                      {exercises.ExerciseSets.map((set, index) => (
                        <li key={set.id || index}>
                          <p>
                            <strong>Set {index + 1}:</strong> {set.sets} sets x {set.reps} reps @{" "}
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
            <p>No previous exercises available.</p>
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
        </div>
        ) : (
            <p>No previous workout data available.</p>
        )}
      </div>
        }
    </div>
  );
}

export default EditWorkoutDetails;
