import { csrfFetch } from './csrf';

const SET_WORKOUT = "/workout/setWorkout";
const SET_FILTERED_WORKOUTS = "workout/setFilteredWorkouts";
const SET_MOST_RECENT_WORKOUT = "/workout/setMostRecentWorkout";
const SET_WORKOUT_TYPES = "/workout/setWorkoutTypes";
const ADD_EXERCISE = "workout/addExercise";
const REMOVE_WORKOUT = "workout/removeWorkout";
const SET_ALL_WORKOUTS = "workout/setAll";
const SET_WORKOUT_BY_ID = "workout/setId";
const SET_CURRENT_WORKOUT = 'workouts/SET_CURRENT_WORKOUT';


export const setCurrentWorkout = (workout) => ({
    type: SET_CURRENT_WORKOUT,
    workout,
});

const setWorkoutId = (workout) => ({
    type: SET_WORKOUT_BY_ID,
    payload: workout
})

const addExercise = (exercise) => ({
    type: ADD_EXERCISE,
    payload: exercise,
});

const setWorkout = (workout) => ({
    type: SET_WORKOUT,
    payload: workout
})

const setAllWorkouts = (workouts) => ({
    type: SET_ALL_WORKOUTS,
    payload: workouts
})

const setMostRecentWorkout = (workout) => ({
    type: SET_MOST_RECENT_WORKOUT,
    payload: workout
})

const setFilteredWorkouts = (workouts) => ({
    type: SET_FILTERED_WORKOUTS,
    payload: workouts
});

const setWorkoutTypes = (workoutTypes) => ({
    type: SET_WORKOUT_TYPES,
    payload: workoutTypes
})

const removeWorkout = (workoutId) => ({
    type: REMOVE_WORKOUT,
    payload: workoutId,
});

export const setWorkoutIdinStore = (workoutId) => async (dispatch) => {
    const response = await csrfFetch(`/api/workouts/${workoutId}`);

    if (response.ok) {
        const workoutData = await response.json();
        dispatch(setWorkoutId(workoutData));
    } else {
        throw new Error('Failed to fetch workout');
    }
}

export const filteredSearch = (matchedWorkouts) => async (dispatch) => {
    dispatch(setFilteredWorkouts(matchedWorkouts))
}

export const addExerciseToWorkout = (workoutId, exerciseTypeId) => async (dispatch) => {
    const response = await csrfFetch(`/api/workouts/${workoutId}/exercises`, {
        method: 'POST',
        body: JSON.stringify({ exerciseTypeId }),
    });

    if (response.ok) {
        const newExercise = await response.json();
        dispatch(addExercise(newExercise));
        return newExercise;
    } else {
        throw new Error("Failed to add exercise");
    }
};

export const fetchAllWorkouts = () => async (dispatch) => {
    const response = await csrfFetch('/api/workouts');

    if (response.ok) {
        const workouts = await response.json();
        dispatch(setAllWorkouts(workouts));
    } else {
        throw new Error('failed to get workouts')
    }
};

export const createWorkout = (workoutData) => async (dispatch) => {
    const response = await csrfFetch('/api/workouts', {
        method: "POST",
        body: JSON.stringify(workoutData)
    });

    if (response.ok) {
        const { newWorkout } = await response.json();
        dispatch(setMostRecentWorkout(newWorkout));
        return newWorkout;
    } else {
        throw new Error('Failed to create workout')
    }
}

export const deleteWorkout = (workoutId) => async (dispatch) => {
    const response = await csrfFetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(removeWorkout(workoutId));
        return { message: 'Successfully deleted' };
    } else {
        throw new Error('Failed to delete workout');
    }
};

export const editWorkoutFocus = (workoutId, data) => async (dispatch) => {
    const { workoutTypeId } = data;
    const response = await csrfFetch(`/api/workouts/${workoutId}`, {
        method: 'PUT',
        body: JSON.stringify({ workoutTypeId }),
    });

    if (response.ok) {
        const updatedWorkout = await response.json();
        dispatch(findWorkoutById(workoutId))
        return updatedWorkout;
    } else {
        throw new Error('Failed to update workout focus');
    }
};

export const findWorkoutById = (workoutId) => async (dispatch) => {

    const response = await csrfFetch(`/api/workouts/${workoutId}`);

    if (response.ok) {
        const workoutData = await response.json();
        dispatch(setWorkout(workoutData));
    } else {
        throw new Error('Failed to fetch workout');
    }

}

export const findMostRecentWorkout = () => async (dispatch) => {
    const response = await csrfFetch('/api/workouts/most-recent');

    if (response.ok) {
        const mostRecentWorkout = await response.json();
        dispatch(setMostRecentWorkout(mostRecentWorkout));
        return mostRecentWorkout;
    } else {
        throw new Error('No workouts found')
    }
}

export const findWorkoutsByFocus = (focus) => async(dispatch) => {
    const query = `?focus=${encodeURIComponent(focus)}`
    console.log(query)
    const response = await csrfFetch(`/api/workouts/most-recent${query}`);

    if (response.ok) {
        const workouts = await response.json();
        dispatch(setFilteredWorkouts(workouts))
        return workouts;
    } else {
        dispatch(setFilteredWorkouts([]))
    }
}

// get all focuses for workouts
export const fetchWorkoutTypes = () => async (dispatch) => {
    const response = await csrfFetch('/api/workouts/workoutTypes');

    if (response.ok) {
        const workoutTypes = await response.json();
        await dispatch(setWorkoutTypes(workoutTypes));
        return workoutTypes
    } else {
        throw new Error("Failed to load WorkoutTypes")
    }

}

//get current workout
export const findCurrentWorkout = () => async (dispatch) => {
    const response = await csrfFetch('/api/workouts/current');
    if (response.ok) {
        const currentWorkout = await response.json();
        dispatch(setCurrentWorkout(currentWorkout));
    } else {
        throw new Error("Failed to load Current Workout")
    }
};


//set current status to true
export const setWorkoutasCurrent = (workoutId) => async (dispatch) => {

      const response = await csrfFetch(`/api/workouts/${workoutId}/set-current`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to set workout as current');
      }

      const data = await response.json();

      dispatch(setCurrentWorkout(data.workout))
  };


//set current status to false
export const finishCurrentWorkout = (workoutId) => async (dispatch) => {
    const response = await csrfFetch(`/api/workouts/${workoutId}/finish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        // const updatedWorkout = await response.json();
        dispatch(setCurrentWorkout(null));
    } else {
        throw new Error('Failed to finish workout');
    }
};

//create a new workout focus
export const createWorkoutType = (workoutTypeData) => async (dispatch) => {
    const response = await csrfFetch('/api/workouts/workoutTypes', {
        method: 'POST',
        body: JSON.stringify(workoutTypeData),
    });

    if (response.ok) {
        const newWorkoutType = await response.json();
        await dispatch(fetchWorkoutTypes());
        return newWorkoutType;
    } else {
        throw new Error('Failed to create workout type');
    }
};


const initialState = {
    workouts: [],
    workout: null,
    mostRecentWorkout: null,
    currentWorkout: null,
    filteredWorkouts: [],
    workoutTypes: [],
    workoutIds: {}
}

const workoutReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_WORKOUT_BY_ID:
            return {
                ...state,
                workoutIds: {
                    ...state.workoutIds,
                    [action.payload.id]: action.payload
                }
            }
        case SET_CURRENT_WORKOUT:
            return {
                ...state,
                currentWorkout: action.workout,
            };
        case SET_ALL_WORKOUTS:
            return {
                ...state,
                workouts: action.payload
            }
        case SET_WORKOUT:
            return {
                ...state,
                workout: action.payload
            }
        case SET_MOST_RECENT_WORKOUT:
            return {
                ...state,
                mostRecentWorkout: action.payload
            }
        case SET_FILTERED_WORKOUTS:
            return {
                ...state,
                filteredWorkouts: action.payload
            }
        case SET_WORKOUT_TYPES:
            return {
                ...state,
                workoutTypes: action.payload
            }
        case ADD_EXERCISE:
            return {
                ...state,
                workout: {
                    ...state.workout,
                    Exercises: [...state.workout.Exercises, action.payload],
                },
            };
        case REMOVE_WORKOUT:
            return {
                ...state,
                workout: null,
                filteredWorkouts: state.filteredWorkouts.filter(
                    (workout) => workout.id !== action.payload
                ),
            };
        default:
            return state;
    }

}

export default workoutReducer;
