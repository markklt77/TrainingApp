
import { csrfFetch } from "./csrf";
import * as workoutActions from './workout'

const SET_EXERCISE_TYPES = 'exerciseTypes/setExerciseTypes';
const CLEAR_EXERCISE_TYPES = 'exerciseTypes/clearExerciseTypes';
const SET_EXERCISES = '/exercises'

const setExerciseTypes = (exerciseTypes) => ({
    type: SET_EXERCISE_TYPES,
    payload: exerciseTypes,
});

const clearExerciseTypes = () => ({
    type: CLEAR_EXERCISE_TYPES,
});

const setExercises = (exercises) => ({
    type: SET_EXERCISES,
    payload: exercises
})

// add an exercise to a workout
export const addExerciseToWorkout = (workoutId, exerciseTypeId) => async (dispatch) => {
    const response = await csrfFetch(`/api/workouts/${workoutId}/exercises`, {
        method: 'POST',
        body: JSON.stringify({exerciseTypeId})
    });

    if (response.ok) {
        const newExercise = await response.json()
        return newExercise;
    } else {
        throw new Error("Failed to add exercise")
    }
}

//get all exercises based on type
export const getExercisesFromType = (exerciseTypeId) => async (dispatch) => {
    const response = await csrfFetch(`/api/exercises/${exerciseTypeId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch exercises")
    }

    const exercises = await response.json();
    dispatch(setExercises(exercises))
    return exercises;
}

//remove an exercise from a workout
export const deleteExerciseFromWorkout = (workoutId, exerciseId) => async (dispatch) => {
    const response = await csrfFetch(`/api/workouts/${workoutId}/exercises/${exerciseId}`, {
        method: 'DELETE',
    })


    if (response.ok) {
        const message = await response.json();
        dispatch(workoutActions.findWorkoutById(workoutId))
        return message;
    } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete the exercise');
    }
}

//create a new exerciseType
export const createExerciseType = (exerciseTypeData) => async (dispatch) => {

        const response = await csrfFetch('/api/exercises/exerciseTypes', {
            method: 'POST',
            body: JSON.stringify(exerciseTypeData),
        });

        if (response.ok) {
            const newExerciseType = await response.json();
            await dispatch(fetchExerciseTypes());
            return newExerciseType;
        } else {
            throw new Error('Failed to create exercise type');
        }

};


export const fetchExerciseTypes = () => async (dispatch) => {
    const response = await csrfFetch('/api/exercises/exerciseTypes');
    if (response.ok) {
         const exerciseTypes = await response.json();
         dispatch(setExerciseTypes(exerciseTypes))
    } else {
        throw new Error("Failed to get exercise types")
    }
}

const initialState = {
    exerciseTypes: [],
    exercises: []
};

export const addSetToExercise = (workoutId, exerciseId, setData) => async (dispatch) => {
    const response = await csrfFetch(`/api/workouts/exercises/${exerciseId}`, {
        method: 'POST',
        body: JSON.stringify(setData)
    });

    if (response.ok) {
        const newSetEntry = await response.json();
        dispatch(workoutActions.findWorkoutById(workoutId))
        return newSetEntry;
    } else {
        throw new Error('Failed to add set to exercise')
    }
}

export const deleteSetFromExercise = (workoutId, exerciseId, exerciseSetId) => async (dispatch) => {
    const response = await csrfFetch(`/api/workouts/exercises/${exerciseId}/${exerciseSetId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        const message = await response.json();
        dispatch(workoutActions.findWorkoutById(workoutId))
        return message;
    } else {
        throw new Error('Failed to delete exercise Set')
    }
}

const exerciseReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_EXERCISES:
            return {
                ...state,
                exercises: action.payload
            }
        case SET_EXERCISE_TYPES:
            return {
                ...state,
                exerciseTypes: action.payload,
            };
        case CLEAR_EXERCISE_TYPES:
            return {
                ...state,
                exerciseTypes: [],
            };
        default:
            return state;
    }
};

export default exerciseReducer;
