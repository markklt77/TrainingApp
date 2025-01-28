

import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import * as workoutActions from "../../store/workout";
import RenderWorkoutDetails from "../RenderWorkoutDetails";
import debounce from "lodash.debounce";
import Fuse from "fuse.js";
import "./ViewWorkoutPage.css";

function ViewWorkoutPage() {
    const dispatch = useDispatch();
    const [focus, setFocus] = useState("");
    const [searchLocked, setSearchLocked] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const [viewMode, setViewMode] = useState("mostRecent");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const mostRecentWorkout = useSelector((state) => state.workouts.mostRecentWorkout);
    const filteredWorkouts = useSelector((state) => state.workouts.filteredWorkouts);
    const workouts = useSelector((state) => state.workouts.workouts);

    const processedWorkouts = workouts.map(workout => {
        return {...workout, focus: workout.WorkoutType?.focus || ""}
    });

    useEffect(() => {
        dispatch(workoutActions.findMostRecentWorkout());
        dispatch(workoutActions.fetchAllWorkouts());
    }, [dispatch]);

    const fuseOptions = {
        keys: ['focus'],
        threshold: 0.3,
        includeScore: true,
        isCaseSensitive: false,
    };

    const fuse = new Fuse(processedWorkouts, fuseOptions);

    const performSearch = debounce((query) => {
        try {
            if (!query.trim()) {
                dispatch(workoutActions.filteredSearch([]));
                setSearchError(false);
                return;
            }

            const results = fuse.search(query);
            if (results.length > 0) {
                const matchedWorkouts = results.map((result) => result.item);
                dispatch(workoutActions.filteredSearch(matchedWorkouts));
                setSearchError(false);
            } else {
                setSearchError(true);
            }
        } catch (error) {
            console.error("Error performing search:", error);
            setSearchError(true);
        }
    }, 500);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setFocus(value);
        setSearchLocked(false);
        setCurrentPage(1);

        if (value) {
            performSearch(value);
        }
    };

    const handleViewToggle = (mode) => {
        setViewMode(mode);
        setFocus("");
        setSearchError(false);
        setSearchLocked(false);
        setCurrentPage(1);
        dispatch(workoutActions.filteredSearch([]));
    };

    const paginate = (data) => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };


    return (
        <div className="view-workout-page-holder">
        <div className="view-workout-page">
            <div className="create-workout-link-div">
                <Link to="/home" className="back-button">Back to Dashboard</Link>
            </div>

            <h1>Workout Viewer</h1>

            <div className="button-group">
                <button className='search-button' onClick={() => handleViewToggle("mostRecent")}>Most Recent </button>
                <button className='search-button' onClick={() => handleViewToggle("allWorkouts")}>Show All </button>
            </div>

            <div className="search-container">
                <img src="https://cdn2.iconfinder.com/data/icons/clean-simple/75/search-512.png" alt="Search" className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by focus (e.g., arms, legs etc)"
                    value={focus}
                    onChange={handleInputChange}
                />
            </div>

            {!focus && !searchLocked && viewMode === 'mostRecent' && (
                <div className="render-details-holder-div">
                    <h2>Most Recent Workout</h2>
                    {mostRecentWorkout && mostRecentWorkout.length > 0 ? (
                        <RenderWorkoutDetails workoutId={mostRecentWorkout[0]?.id} />
                    ) : (
                        <p>No workouts found.</p>
                    )}
                </div>
            )}

            {!focus && !searchLocked && viewMode === 'allWorkouts' && (
                <div>
                    <h2>All Workouts</h2>
                    {workouts && workouts.length > 0 ? (
                        <div>
                            <div className="workout-list">
                                {paginate(workouts).map((workout) => (
                                    workout.id ? (
                                        <div key={workout.id} className="workout-item">
                                            <RenderWorkoutDetails workoutId={workout.id} />
                                        </div>
                                    ) : (
                                        <p key={workout.id}>Invalid workout data</p>
                                    )
                                ))}
                            </div>
                            <div className="pagination-controls">
                                <button
                                    className='next-prev-button'
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <button
                                    className='next-prev-button'
                                    onClick={handleNextPage}
                                    disabled={currentPage * itemsPerPage >= workouts.length}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>No workouts found.</p>
                    )}
                </div>
            )}

            {focus && (
                <div>
                    <h2>{searchLocked ? 'Search Results' : 'Live Search Results'}</h2>
                    {searchError ? (
                        <p>No workouts found for &quot;{focus}&quot;.</p>
                    ) : filteredWorkouts.length === 0 ? (
                        <p>No workouts found for &quot;{focus}&quot;.</p>
                    ) : (
                        <div>
                            <div className="workout-list">
                                {paginate(filteredWorkouts).map((workout) => (
                                    workout.id ? (
                                        <div key={workout.id} className="workout-item">
                                            <RenderWorkoutDetails workoutId={workout.id} />
                                        </div>
                                    ) : (
                                        <p key={workout.id}>Invalid workout data</p>
                                    )
                                ))}
                            </div>
                            <div className="pagination-controls">
                                <button
                                    className='next-prev-button'
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <button
                                    className='next-prev-button'
                                    onClick={handleNextPage}
                                    disabled={currentPage * itemsPerPage >= filteredWorkouts.length}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
        </div>
    );

}

export default ViewWorkoutPage;
