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
    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        dispatch(workoutActions.fetchWorkoutTypes());
    }, [dispatch]);

    const onSubmit = async (data) => {
        try {
            await dispatch(workoutActions.createWorkout(data));
            reset();
            navigate('/workouts/current');
            showNotification('Workout Created!', 'success');
        } catch (error) {
            setError("root", {
                message: "Failed to Create Workout",
            });
        }
    };

    const handleDropdownChange = (e) => {
        if (e.target.value === "add-new") {
            setShowNewTypeForm(true);
        }
    };

    const handleNewTypeSuccess = () => {
        setShowNewTypeForm(false);
        dispatch(workoutActions.fetchWorkoutTypes());
    };

    return (
            <div className="form-holder-div section">
                    <label className="create-workout-label" >Create a New Workout!</label>

                    <label className="hitting-label">What are you hitting today?</label>


                    {showNewTypeForm ? (
                        <CreateNewTypeForm
                            thunk={workoutActions.createWorkoutType}
                            type={"workout"}
                            onSuccess={handleNewTypeSuccess}
                            onCancel={() => setShowNewTypeForm(false)}
                        />
                    ) : (
                    <form className="create-workout-form" onSubmit={handleSubmit(onSubmit)}>
                        <select
                            id="create-workout-select-field"
                            className="create-workout-form-input"
                            {...register("workoutTypeId", { required: "Please select a workout type" })}
                            onChange={handleDropdownChange}
                        >
                            <option value="">Select Workout Type</option>
                            {workoutTypes &&
                                workoutTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.focus}
                                    </option>
                                ))}
                            <option className='add-new' value="add-new">Add New Workout Type</option>
                        </select>


                    {errors.workoutTypeId && (
                        <p className="landing-page-error">{errors.workoutTypeId.message}</p>
                    )}

                    <button className="workout-form-button btn" disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Creating Workout..." : "Create Workout"}
                    </button>

                    {errors.root && (
                        <p className="landing-page-error">{errors.root.message}</p>
                    )}
                </form>
                )}
            </div>
    );
}



export default CreateWorkoutForm;
