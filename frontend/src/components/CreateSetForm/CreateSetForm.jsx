import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as exerciseActions from '../../store/exercise'

function CreateSetForm( { workoutId, exerciseId, onCloseForm }) {
    const dispatch = useDispatch();

    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting} } = useForm();

    const onSubmit = async(data) => {
        try {
            const newSet = await dispatch(exerciseActions.addSetToExercise(workoutId, exerciseId, data));
            reset();
            if (onCloseForm) onCloseForm();
            return newSet;
        } catch {
            setError('root', {
                message: "Failed to add set to exercise"
            })
        }
    }

    return (
        <form className="create-set-form" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="sets">Sets</label>
                <input
                    id="sets"
                    type="number"
                    min="1"
                    {...register('sets', {required: "Enter the number of Sets", valueAsNumber: true})}
                />
                {errors.sets && <p className="create-set-form-error">{errors.sets.message}</p>}
            </div>
            <div>
                <label htmlFor="reps">Reps</label>
                <input
                    id="reps"
                    type="number"
                    min="1"
                    {...register('reps', { required: "Enter the number of Reps", valueAsNumber: true})}
                />
                { errors.reps && <p className="create-set-form-error">{ errors.reps.message}</p>}
            </div>
            <div>
                <label htmlFor="weight">Weight (lbs)</label>
                <input
                    id="weight"
                    type="number"
                    min="0"
                    step="0.25"
                    {...register("weight", { required: "Enter the Weight", valueAsNumber: true })}
                />
                { errors.weight && <p className="create-set-form-error">{ errors.weight.message }</p>}
            </div>
            {errors.root && <p className="create-set-form-error">{errors.root.message}</p>}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding Set..." : "Add Set"}
            </button>
        </form>
    )
}

export default CreateSetForm;
