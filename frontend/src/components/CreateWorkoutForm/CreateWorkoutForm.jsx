import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import * as workoutActions from "../../store/workout";
import CreateNewTypeForm from "../CreateNewTypeForm";
import { useNotification } from "../../context/NotificationContext";
import "./CreateWorkoutForm.css"

function CreateWorkoutForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const workoutTypes = useSelector((state) => state.workouts.workoutTypes);
    const [showNewTypeForm, setShowNewTypeForm] = useState(false);
    const {register, handleSubmit, reset, setError, formState: { errors, isSubmitting } }= useForm();

    useEffect(() => {
        dispatch(workoutActions.fetchWorkoutTypes());
    }, [dispatch]);


    const onSubmit = async (data) => {
        try {
            await dispatch(workoutActions.createWorkout(data))
            reset();
            navigate('/workouts/view')
            showNotification('Workout Created!', 'success');
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
        <div className="create-workout-form-div">
            {showNewTypeForm ? (
                <CreateNewTypeForm
                    thunk={workoutActions.createWorkoutType}
                    type="Workout"
                    onSuccess={() => {
                        setShowNewTypeForm(false);
                    }}
                    onCancel={() => setShowNewTypeForm(false)}
                />
            ) : (
                <form className="create-workout-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="create-workout-link-div">
                        <Link to="/home" className="back-button">Back to Dashboard</Link>
                    </div>
                    <label className='create-workout-label' htmlFor="create-workout-select-field">Create a New Workout!</label>
                    <div className="hitting-div">
                        <label>What are you hitting today?</label>
                    </div>
                    <select
                        id='create-workout-select-field'
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
                        <p className="landing-page-error">{errors.workoutTypeId.message}</p>
                    )}

                    <button className="create-workout-button" disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Creating Workout..." : "Create Workout"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default CreateWorkoutForm;
