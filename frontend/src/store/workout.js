import { csrfFetch } from './csrf';

const SET_WORKOUT = "/workout/setWorkout";
const SET_FILTERED_WORKOUTS = "workout/setFilteredWorkouts";
const SET_MOST_RECENT_WORKOUT = "/workout/setMostRecentWorkout"
const SET_WORKOUT_TYPES = "/workout/setWorkoutTypes"
const ADD_EXERCISE = "workout/addExercise";

const addExercise = (exercise) => ({
    type: ADD_EXERCISE,
    payload: exercise,
});


const setWorkout = (workout) => ({
    type: SET_WORKOUT,
    payload: workout
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

export const fetchWorkoutTypes = () => async (dispatch) => {
    const response = await csrfFetch('/api/workouts/workoutTypes');

    if (response.ok) {
        const workoutTypes = await response.json();
        dispatch(setWorkoutTypes(workoutTypes));
        return workoutTypes
    } else {
        throw new Error("Failed to load WorkoutTypes")
    }

}

export const createWorkoutType = (workoutTypeData) => async (dispatch) => {
    const response = await csrfFetch('/api/workouts/workoutTypes', {
        method: 'POST',
        body: JSON.stringify(workoutTypeData),
    });

    if (response.ok) {
        const newWorkoutType = await response.json();
        dispatch(fetchWorkoutTypes());
        return newWorkoutType;
    } else {
        throw new Error('Failed to create workout type');
    }
};


const initialState = {
    workout: null,
    mostRecentWorkout: null,
    filteredWorkouts: [],
    workoutTypes: []
}

const workoutReducer = (state = initialState, action) => {
    switch(action.type) {
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
        default:
            return state;
    }

}

export default workoutReducer;
