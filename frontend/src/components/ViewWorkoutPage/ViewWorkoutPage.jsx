import { useSelector, useDispatch} from "react-redux";
import { useEffect, useState } from "react";
import * as workoutActions from "../../store/workout"
import RenderWorkoutDetails from "../RenderWorkoutDetails";


function ViewWorkoutPage() {
    const dispatch = useDispatch();
    const [focus, setFocus] = useState("");
    const [searchAttempted, setSearchAttempted] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const mostRecentWorkout = useSelector((state) => state.workouts.mostRecentWorkout);
    const filteredWorkouts = useSelector((state) => state.workouts.filteredWorkouts)


    useEffect(() => {
        dispatch(workoutActions.findMostRecentWorkout());
    }, [dispatch]);

    if (!mostRecentWorkout) {
        return <div>Loading...</div>;
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchAttempted(true);
        setSearchError(false);

        try {
            await dispatch(workoutActions.findWorkoutsByFocus(focus));
        } catch (err) {
            setSearchError(true)
        }

    }

    return (
        <div>
            <h1>Workout Viewer</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by focus (e.g., arms, legs etc)"
                    value={focus}
                    onChange={(e) => {
                        setFocus(e.target.value);
                        setSearchAttempted(false);
                        setSearchError(false);
                    }}
                />
                <button type="submit">Search</button>
            </form>
            {!focus && (
                <div>
                    {!mostRecentWorkout || mostRecentWorkout.length === 0 ? (
                        <div>Loading...</div>
                    ) : (
                        <div>
                            <h2>Most Recent Workout</h2>
                            <RenderWorkoutDetails workoutId={mostRecentWorkout[0]?.id} />
                        </div>
                    )}
                </div>
            )}

            {focus && searchAttempted && (
                <div>
                    <h2>Search Results</h2>
                    {searchError ? (
                        <p>No workouts found for "{focus}".</p>
                    ) : filteredWorkouts.length === 0 ? (
                        <p>No workouts found for "{focus}".</p>
                    ) : (
                        <div>
                            {filteredWorkouts.map((workout) => (
                                workout.id ? (  // Check if workout.id is available
                                    <RenderWorkoutDetails key={workout.id} workoutId={workout.id} />
                                ) : (
                                    <p key={workout.id}>Invalid workout data</p>
                                )
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>

    );
}

export default ViewWorkoutPage;
