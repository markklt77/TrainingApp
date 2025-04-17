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
    const [showForm, setShowForm] = useState(false);
    const [showNewTypeForm, setShowNewTypeForm] = useState(false);

    const exerciseTypes = useSelector((state) => state.exercises.exerciseTypes);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await dispatch(exerciseActions.fetchExerciseTypes());
                if (result.length === 0) {
                    setShowNewTypeForm(true); // Show CreateNewTypeForm if no types exist
                }
            } catch (error) {
                console.log(error)
                setShowNewTypeForm(true); // Show CreateNewTypeForm if fetch fails
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
            showNotification('Exercise Created!', 'success');
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
            {showForm ? (
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
                            ) : (
                                <>
                                    <h4 className="create-exercise-header">Create an Exercise</h4>
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
                                        <option className='add-new' value="add-new">Add New Exercise Type</option>
                                    </select>
                                    {errors.exerciseTypeId && (
                                        <div className="landing-page-error">
                                            {errors.exerciseTypeId.message}
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="create-exercise-form-button-div">
                                <button className='btn' disabled={isSubmitting || loading} type="submit">
                                    {isSubmitting ? "Adding Exercise..." : "Add Exercise"}
                                </button>

                                <button className="btn" onClick={toggleShowForm}>
                                    Cancel
                                </button>
                            </div>
                            {errors.root && (
                                <div className="landing-page-error">{errors.root.message}</div>
                            )}
                        </form>
                    )}
                </>
            ) : (
                <button className="btn" onClick={toggleShowForm}>
                    Add Exercise
                </button>
            )}
        </div>
    );
}

export default ExerciseForm;
