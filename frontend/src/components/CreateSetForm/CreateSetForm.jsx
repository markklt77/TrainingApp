import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as exerciseActions from '../../store/exercise'
import { useNotification } from "../../context/NotificationContext";
import './CreateSetForm.css';

function CreateSetForm( { workoutId, exerciseId, onCloseForm }) {
    const dispatch = useDispatch();

    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting} } = useForm();
    const { showNotification } = useNotification();

    const onSubmit = async(data) => {
        try {
            await dispatch(exerciseActions.addSetToExercise(workoutId, exerciseId, data));
            reset();
            showNotification("Set Added!", "success")
            if (onCloseForm) onCloseForm();
        } catch {
            setError('root', {
                message: "Failed to add set to exercise"
            })
        }
    }

    return (
        <>
        <form className="create-set-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="set-input-label-div">
                <label htmlFor="sets">Sets</label>
                <input
                    className="set-form-input"
                    id="sets"
                    type="number"
                    min="1"
                    {...register('sets', {required: "Enter the number of Sets", valueAsNumber: true})}
                />
                {errors.sets && <p className="landing-page-error">{errors.sets.message}</p>}
            </div>
            <div className="set-input-label-div">
                <label htmlFor="reps">Reps</label>
                <input
                    className="set-form-input"
                    id="reps"
                    type="number"
                    min="1"
                    {...register('reps', { required: "Enter the number of Reps", valueAsNumber: true})}
                />
                { errors.reps && <p className="landing-page-error">{ errors.reps.message}</p>}
            </div>
            <div className="set-input-label-div">
                <label htmlFor="weight">Weight (lbs)</label>
                <input
                    className="set-form-input"
                    id="weight"
                    type="number"
                    min="0"
                    step="0.25"
                    {...register("weight", { required: "Enter the Weight", valueAsNumber: true })}
                />
                { errors.weight && <p className="landing-page-error">{ errors.weight.message }</p>}
            </div>
            {errors.root && <p className="landing-page-error">{errors.root.message}</p>}
            <button className='editor-button' type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding Set..." : "Add Set"}
            </button>
        </form>
        </>
    )
}

export default CreateSetForm;
