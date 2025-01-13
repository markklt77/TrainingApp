import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import * as workoutActions from "../../store/workout";
import RenderWorkoutDetails from "../RenderWorkoutDetails";
import debounce from "lodash.debounce";
import Fuse from "fuse.js";

function ViewWorkoutPage() {
    const dispatch = useDispatch();
    const [focus, setFocus] = useState("");
    const [searchLocked, setSearchLocked] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const [viewMode, setViewMode] = useState("mostRecent");

    const mostRecentWorkout = useSelector((state) => state.workouts.mostRecentWorkout);
    const filteredWorkouts = useSelector((state) => state.workouts.filteredWorkouts);
    const workouts = useSelector((state) => state.workouts.workouts);

    console.log(workouts)

    const processedWorkouts = workouts.map(workout => {
        return {...workout, focus: workout.WorkoutType?.focus || ""}
    })


    useEffect(() => {
        dispatch(workoutActions.findMostRecentWorkout());
        dispatch(workoutActions.fetchAllWorkouts())
    }, [dispatch]);

    const fuseOptions = {
        keys: ['focus'],
        threshold: 0.3,
        includeScore: true,
        isCaseSensitive: false,
    };

    const fuse = new Fuse(processedWorkouts, fuseOptions);

    // const performSearch = debounce(async (query) => {
    //     try {
    //         await dispatch(workoutActions.findWorkoutsByFocus(query));
    //         setSearchError(false);
    //     } catch (error) {
    //         setSearchError(true);
    //     }
    // }, 500);

    const performSearch = debounce((query) => {
        try {
            if (!query.trim()) {
                dispatch(workoutActions.filteredSearch([]));
                setSearchError(false);
                return;
            }

            const results = fuse.search(query)
            console.log(results)
            if (results.length > 0) {

                const matchedWorkouts = results.map((result) => result.item);


                dispatch(workoutActions.filteredSearch(matchedWorkouts));
                setSearchError(false);
            } else {

                setSearchError(true);
            }

        } catch(error) {
            console.error("Error performing search:", error);
            setSearchError(true);
        }
    }, 500)


    const handleInputChange = (e) => {
        const value = e.target.value;
        setFocus(value);
        setSearchLocked(false);

        if (value) {
            performSearch(value);
        }
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setSearchLocked(true);

        try {
            await dispatch(workoutActions.findWorkoutsByFocus(focus));
            setSearchError(false);
        } catch (error) {
            setSearchError(true);
        }
    };

    const handleViewToggle = (mode) => {
        setViewMode(mode);
        setFocus("");
        setSearchError(false);
        setSearchLocked(false);
        dispatch(workoutActions.filteredSearch([]));
    }

    if (!mostRecentWorkout) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Workout Viewer</h1>

            <div>
                <button onClick={() => handleViewToggle("mostRecent")}>Most Recent Workout</button>
                <button onClick={() => handleViewToggle("allWorkouts")}>Show All Workouts</button>
            </div>

            <form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Search by focus (e.g., arms, legs etc)"
                    value={focus}
                    onChange={handleInputChange}
                />
                <button type="submit">Search</button>
            </form>

            {/* Display most recent workout when no focus and search is not locked */}
            {!focus && !searchLocked && viewMode === 'mostRecent' && (
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

            {!focus && !searchLocked && viewMode === 'allWorkouts' && (
                <div>
                    {!workouts || workouts.length === 0 ? (
                        <div>Loading...</div>
                    ) : (
                        <div>
                            <h2>All Workouts</h2>
                            {workouts.map((workout) => (
                                workout.id ? (
                                    <RenderWorkoutDetails key={workout.id} workoutId={workout.id} />
                                ) : (
                                    <p key={workout.id}>Invalid workout data</p>
                                )
                            ))}
                        </div>
                    )}
                </div>
            )}


            {/* Display search results or live search results */}
            {focus && (
                <div>
                    <h2>{searchLocked ? 'Search Results' : 'Live Search Results'}</h2>
                    {searchError ? (
                        <p>No workouts found for &quot;{focus}&quot;.</p>
                    ) : filteredWorkouts.length === 0 ? (
                        <p>No workouts found for &quot;{focus}&quot;.</p>
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
