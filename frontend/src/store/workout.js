import { csrfFetch } from './csrf';

const SET_WORKOUT = "/workout/setWorkout";

const setSingleWorkout = (workout) => ({
    type: SET_WORKOUT,
    payload: workout
})

export const createWorkout = (workoutData) => async (dispatch) => {
    const response = await csrfFetch('/api/workouts', {
        method: "POST",
        body: JSON.stringify(workoutData)
    });

    if (response.ok) {
        const { newWorkout } = await response.json();
        dispatch(setSingleWorkout(newWorkout));
    } else {
        throw new Error('Failed to create workout')
    }
}

const initialState = {
    workout: null
}

const workoutReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_WORKOUT:
            return {
                ...state,
                workout: action.payload
            }
        default:
            return state;
    }

}

export default workoutReducer;
