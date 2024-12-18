import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as workoutActions from "../../store/workout";
import "./CreateWorkoutForm.css"

function CreateWorkoutForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const workoutTypes = useSelector((state) => state.workouts.workoutTypes);

    const {register, handleSubmit, reset, setError, formState: { errors, isSubmitting } }= useForm();

    useEffect(() => {
        dispatch(workoutActions.fetchWorkoutTypes());
    }, [dispatch]);


    const onSubmit = async (data) => {
        try {
            console.log(data)
            const newWorkout = await dispatch(workoutActions.createWorkout(data))
            console.log(newWorkout)
            reset();
            navigate('/workouts/view')
        } catch(error) {
            setError("root", {
                message: "Failed to Create Workout"
            })
        }
    }

    return (
        <form className="create-workout-form" onSubmit={handleSubmit(onSubmit)}>
            <select className="create-workout-form-input" {...register("workoutTypeId", { required: "Please select a workout focus" })}>
                <option value="">Select Workout Focus</option>
                {workoutTypes && workoutTypes.map((workoutType) => (
                    <option key={workoutType.id} value={workoutType.id}>
                        {workoutType.focus}
                    </option>
                ))}
            </select>
            {errors.workoutTypeId && <div className="create-workout-form-error-text">{errors.workoutTypeId.message}</div>}
            <button disabled={isSubmitting} type="submit"> {isSubmitting? "Creating Workout..." : "Create Workout"} </button>
            { errors.root && <div className="create-workout-form-error-text">{errors.root.message}</div>}
        </form>
    )
}

export default CreateWorkoutForm;
