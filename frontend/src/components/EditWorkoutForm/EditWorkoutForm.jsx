import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as workoutActions from "../../store/workout";
import CreateNewTypeForm from "../CreateNewTypeForm";
import "./EditWorkoutForm.css"

function EditWorkoutForm( { workoutId, currentFocus }) {
    const dispatch = useDispatch();

    const workoutTypes = useSelector((state) => state.workouts.workoutTypes);
    const [showNewTypeForm, setShowNewTypeForm] = useState(false);
    const {register, handleSubmit, reset, setValue, setError, formState: { errors, isSubmitting } }= useForm();

    useEffect(() => {
        dispatch(workoutActions.fetchWorkoutTypes());
        if (currentFocus) {
            setValue("workoutTypeId", currentFocus);
        }
    }, [dispatch, currentFocus, setValue]);


    const onSubmit = async (data) => {
        try {
            const { workoutTypeId } = data
            const newWorkout = await dispatch(workoutActions.editWorkoutFocus(workoutId, { workoutTypeId }))
            reset();
            return newWorkout;
        } catch(error) {
            setError("root", {
                message: "Failed to Edit Workout"
            })
        }
    }

    const handleDropdownChange = (e) => {
        if (e.target.value === "add-new") {
            setShowNewTypeForm(true);
        }
    };

    return (
        <div>
            {showNewTypeForm ? (
                <CreateNewTypeForm
                    thunk={workoutActions.createWorkoutType}
                    type="workout"
                    onSuccess={() => {
                        setShowNewTypeForm(false);
                    }}
                    onCancel={() => setShowNewTypeForm(false)}
                />
            ) : (
                <form className="create-workout-form" onSubmit={handleSubmit(onSubmit)}>
                    <select
                        className="create-workout-form-input"
                        {...register("workoutTypeId", { required: "Please select a workout focus" })}
                        onChange={handleDropdownChange}
                    >
                        <option value="">Select Workout Focus</option>
                        {workoutTypes &&
                            workoutTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.focus}
                                </option>
                            ))}
                        <option value="add-new">+ Add New Workout Focus</option>
                    </select>
                    {errors.workoutTypeId && (
                        <p className="error-text">{errors.workoutTypeId.message}</p>
                    )}

                    <button disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Saving..." : "Save Edit"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default EditWorkoutForm;