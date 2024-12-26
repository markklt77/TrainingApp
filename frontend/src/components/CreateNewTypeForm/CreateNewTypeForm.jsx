import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import "./CreateNewTypeForm.css";

function CreateNewTypeForm({ thunk, type, onSuccess, onCancel }) {
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            await dispatch(thunk(data));
            reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(`Failed to create ${type}:`, error);
        }
    };

    return (
        <form className="create-new-type-form" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="inputField">
                {type === "workout" ? "new Workout Focus" : "New Exercise Name"}
            </label>
            <input
                id="inputField"
                {...register(type === "workout" ? "focus" : "name", {
                    required: `${type === "workout" ? "Workout focus" : "Exercise name"} is required`,
                })}
                placeholder={`Enter ${type === "workout" ? "Workout Focus" : "Exercise Name"}`}
            />
            {errors[type === "workout" ? "focus" : "name"] && (
                <p className="error-text">{errors[type === "workout" ? "focus" : "name"].message}</p>
            )}
            <div className="form-buttons">
                <button disabled={isSubmitting} type="submit">
                    {isSubmitting ? `Adding ${type}...` : `Add ${type}`}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

export default CreateNewTypeForm;
