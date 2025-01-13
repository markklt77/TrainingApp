import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import * as workoutActions from "../../store/workout";
import EditWorkoutDetails from "../EditWorkoutDetails";

function CurrentWorkoutPage() {
    const dispatch = useDispatch();
    const mostRecentWorkout = useSelector((state) => state.workouts.mostRecentWorkout)

    useEffect(() => {
        dispatch(workoutActions.findMostRecentWorkout());
    }, [dispatch]);

    if (!mostRecentWorkout) {
        return <div>Loading most recent workout...</div>;
    }

    return (
        <EditWorkoutDetails workoutId={mostRecentWorkout[0].id} isModal={false}/>
    )
}

export default CurrentWorkoutPage
