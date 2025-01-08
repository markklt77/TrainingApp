import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as exerciseActions from "../../store/exercise";
import * as workoutActions from "../../store/workout"
import CreateNewTypeForm from "../CreateNewTypeForm";

function ExerciseForm({ workoutId }) {
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm();
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
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
            const newExercise = await dispatch(
                workoutActions.addExerciseToWorkout(workoutId, data.exerciseTypeId)
            );
            await dispatch(workoutActions.findWorkoutById(workoutId));
            reset();
            return newExercise;
         } catch (error) {
             setError("root", {
                 message: "Failed to add exercise to workout.",
             });
         }
    };

    const handleDropdownChange = (e) => {
        if (e.target.value === "add-new") {
            setShowNewTypeForm(true);
        }
    };

    return (
        <div>
            {showNewTypeForm ? (
                <CreateNewTypeForm
                    thunk={exerciseActions.createExerciseType}
                    type="exercise"
                    onSuccess={() => {
                        setShowNewTypeForm(false);
                        // dispatch(exerciseActions.fetchExerciseTypes()); // Refresh exercise types
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
                                <div className="create-exercise-form-error-text">
                                    {errors.exerciseTypeId.message}
                                </div>
                            )}
                        </>
                    )}
                    <button disabled={isSubmitting || loading} type="submit">
                        {isSubmitting ? "Adding Exercise..." : "Add Exercise"}
                    </button>
                    {errors.root && (
                        <div className="create-exercise-form-error-text">{errors.root.message}</div>
                    )}
                </form>
            )}
        </div>
    );
}

export default ExerciseForm;
