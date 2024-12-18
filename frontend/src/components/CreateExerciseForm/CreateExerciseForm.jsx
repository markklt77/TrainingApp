import { useState } from "react"
import { useDispatch } from "react-redux"
import * as exerciseActions from "../../store/exercise"

function ExerciseForm({ workoutID }) {
    const dispatch = useDispatch;

    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");
    const [exerciseTypeId, setExerciseTypeId] = useState("")
}
