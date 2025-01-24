import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNotification } from "../../context/NotificationContext";
import "./CreateNewTypeForm.css";

function CreateNewTypeForm({ thunk, type, onSuccess, onCancel }) {
    const dispatch = useDispatch();
    const { showNotification } = useNotification();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();



    const onSubmit = async (data) => {
        try {
            await dispatch(thunk(data));
            console.log('SUBMITTED')
            reset();
            if (onSuccess) onSuccess();
            showNotification(`New ${type} Created`, 'success');
        } catch (error) {
            console.error(`Failed to create ${type}:`, error);
        }
    };

    return (
        <>
         <form className="create-new-type-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="type-form-input-div">
                    <label className="type-form-label" htmlFor="inputField">
                        {type === "workout" ? "New Workout Focus:" : "New Exercise Name:"}
                    </label>
                    <input
                        id="inputField"
                        {...register(type === "workout" ? "focus" : "name", {
                            required: `${type === "workout" ? "Workout focus" : "Exercise name"} is required`,
                        })}
                        placeholder={`Enter ${type === "workout" ? "Workout Focus" : "Exercise Name"}`}
                    />
                </div>
                {errors[type === "workout" ? "focus" : "name"] && (
                    <p className="landing-page-error">{errors[type === "workout" ? "focus" : "name"].message}</p>
                )}
                <div className="form-buttons">
                    <button className='editor-button' disabled={isSubmitting} type="submit">
                        {isSubmitting ? `Adding ${type}...` : `Add new ${type}`}
                    </button>
                    {onCancel && (
                        <button className='editor-button'  type="button" onClick={onCancel}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </>

    );
}

export default CreateNewTypeForm;
