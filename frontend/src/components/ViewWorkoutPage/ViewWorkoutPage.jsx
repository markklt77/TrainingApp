import { useSelector, useDispatch} from "react-redux";
import { useEffect, useState } from "react";
import * as workoutActions from "../../store/workout"


function ViewWorkoutPage() {
    const dispatch = useDispatch();
    const [focus, setFocus] = useState("");
    const [searchAttempted, setSearchAttempted] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const mostRecentWorkout = useSelector((state) => state.workouts.mostRecentWorkout);
    const filteredWorkouts = useSelector((state) => state.workouts.filteredWorkouts)

    // console.log(mostRecentWorkout)

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
                            <p>
                                <strong>Focus:</strong> {mostRecentWorkout[0]?.WorkoutType.focus || "N/A"}
                            </p>
                            <p>
                                <strong>Date:</strong>{" "}
                                {mostRecentWorkout[0]?.createdAt
                                    ? new Date(mostRecentWorkout[0].createdAt).toLocaleDateString()
                                    : "N/A"}
                            </p>
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
                        <ul>
                            {filteredWorkouts.map((workout) => (
                                <li key={workout.id}>
                                    <p>
                                        <strong>Focus:</strong> {workout.WorkoutType.focus}
                                    </p>
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(workout.createdAt).toLocaleDateString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>

    );
}

export default ViewWorkoutPage;
