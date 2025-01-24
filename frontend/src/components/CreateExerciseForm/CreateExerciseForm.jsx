import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import * as exerciseActions from "../../store/exercise";
import * as workoutActions from "../../store/workout"
import CreateNewTypeForm from "../CreateNewTypeForm";
import './CreateExerciseForm.css'

function ExerciseForm({ workoutId }) {
    const dispatch = useDispatch();
    const { showNotification } = useNotification();
    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm();
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showNewTypeForm, setShowNewTypeForm] = useState(false);

    const exerciseTypes = useSelector((state) => state.exercises.exerciseTypes);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await dispatch(exerciseActions.fetchExerciseTypes());
                setFetchError(false);
            } catch (error) {
                setFetchError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch]);

    const onSubmit = async (data) => {
         try {
            await dispatch(workoutActions.addExerciseToWorkout(workoutId, data.exerciseTypeId));
            await dispatch(workoutActions.findWorkoutById(workoutId));
            showNotification('Exercise Created!', 'success')
            reset();
            setShowForm(false);
         } catch (error) {
             setError("root", {
                 message: "Failed to add exercise to workout.",
             });
         }
    };

    const toggleShowForm = () => {
        setShowForm((prevState) => !prevState);
    };

    const handleDropdownChange = (e) => {
        if (e.target.value === "add-new") {
            setShowNewTypeForm(true);
        }
    };

    return (
        <div>
            {showForm? (
                <>
                    {showNewTypeForm ? (
                        <CreateNewTypeForm
                            thunk={exerciseActions.createExerciseType}
                            type={"Exercise"}
                            onSuccess={() => {
                                setShowNewTypeForm(false);
                            }}
                            onCancel={() => setShowNewTypeForm(false)}
                        />
                    ) : (
                        <form className="create-exercise-form" onSubmit={handleSubmit(onSubmit)}>
                            {loading ? (
                                <p>Loading exercise types...</p>
                            ) : fetchError ? (
                                <p>Error loading exercise types. Please try again later.</p>
                            ) : (
                                <>
                                    <h4>Create an Exercise</h4>
                                    <select
                                        className="exercise-select-form"
                                        {...register("exerciseTypeId", { required: "Please select an exercise" })}
                                        onChange={handleDropdownChange}
                                    >
                                        <option value="">Select an exercise</option>
                                        {exerciseTypes &&
                                            exerciseTypes.map((exerciseType) => (
                                                <option key={exerciseType.id} value={exerciseType.id}>
                                                    {exerciseType.name}
                                                </option>
                                            ))}
                                        <option value="add-new">+ Add New Exercise Type</option>
                                    </select>
                                    {errors.exerciseTypeId && (
                                        <div className="landing-page-error">
                                            {errors.exerciseTypeId.message}
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="create-exercise-form-button-div">
                                <button className='exercise-addition-button' disabled={isSubmitting || loading} type="submit">
                                    {isSubmitting ? "Adding Exercise..." : "Add Exercise"}
                                </button>

                                <button className="exercise-addition-button" onClick={toggleShowForm}>
                                    Cancel
                                </button>
                            </div>
                            {errors.root && (
                                <div className="landing-page-error">{errors.root.message}</div>
                            )}
                        </form>
                    )}

                </>
            ):(
                <button className="editor-button" onClick={toggleShowForm}>
                    Add Exercise
                </button>
            )}
        </div>
    );
}

export default ExerciseForm;
