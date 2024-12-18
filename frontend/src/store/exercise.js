import { csrfFetch } from "./csrf";

export const addExerciseToWorkout = (workoutId, exerciseData) => async (dispatch) => {
    const response = csrfFetch(`/api/workouts/${workoutId}/exercises`, {
        method: 'POST',
        body: JSON.stringify(exerciseData)
    });

    if (response.ok) {
        const { newExercise } = await response.json()
        return newExercise;
    } else {
        throw new Error("Failed to add exercise")
    }
}
