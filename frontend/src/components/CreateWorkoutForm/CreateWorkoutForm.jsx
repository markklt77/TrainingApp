import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as workoutActions from "../../store/workout";
import CreateNewTypeForm from "../CreateNewTypeForm";
import "./CreateWorkoutForm.css"

function CreateWorkoutForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const workoutTypes = useSelector((state) => state.workouts.workoutTypes);
    const [showNewTypeForm, setShowNewTypeForm] = useState(false);
    const {register, handleSubmit, reset, setError, formState: { errors, isSubmitting } }= useForm();

    useEffect(() => {
        dispatch(workoutActions.fetchWorkoutTypes());
    }, [dispatch]);


    const onSubmit = async (data) => {
        try {
            const newWorkout = await dispatch(workoutActions.createWorkout(data))
            reset();
            navigate('/workouts/view')
            return newWorkout;
        } catch(error) {
            setError("root", {
                message: "Failed to Create Workout"
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
                        // dispatch(workoutActions.fetchWorkoutTypes());
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
                        {isSubmitting ? "Creating Workout..." : "Create Workout"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default CreateWorkoutForm;
