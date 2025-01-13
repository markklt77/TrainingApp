import { csrfFetch } from "./csrf";

const SET_WEIGHTS = "weights/setWeights";
const ADD_WEIGHT = "weights/addWeight";
const REMOVE_WEIGHT = "weights/removeWeight";
const UPDATE_WEIGHT = "weights/updateWeight";


const setWeights = (weights) => {
    return {
      type: SET_WEIGHTS,
      payload: weights
    };
  };

  const addWeight = (weight) => {
    return {
      type: ADD_WEIGHT,
      payload: weight
    };
  };

  const removeWeight = (id) => {
    return {
      type: REMOVE_WEIGHT,
      payload: id
    };
  };

  const updateWeight = (weight) => {
    return {
      type: UPDATE_WEIGHT,
      payload: weight
    };
  };

  export const fetchWeights = () => async (dispatch) => {
    const response = await csrfFetch("/api/weight");
    const data = await response.json();
    dispatch(setWeights(data.weights));
    return response;
  };


  export const createWeight = (weight) => async (dispatch) => {
    const response = await csrfFetch("/api/weight", {
      method: "POST",
      body: JSON.stringify({ weight })
    });
    const data = await response.json();
    dispatch(addWeight(data.newWeight));
    return response;
  };

  export const deleteWeight = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/weight/${id}`, {
      method: "DELETE"
    });
    dispatch(removeWeight(id));
    return response;
  };

  export const updateWeightById = (id, weight) => async (dispatch) => {
    const response = await csrfFetch(`/api/weight/${id}`, {
      method: "PUT",
      body: JSON.stringify({ weight })
    });
    const data = await response.json();
    dispatch(updateWeight(data.weightEntry));
    return response;
  };

  const initialState = {
    weights: []
  };

  const weightReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_WEIGHTS:
        return { ...state, weights: action.payload };
      case ADD_WEIGHT:
        return { ...state, weights: [...state.weights, action.payload] };
      case REMOVE_WEIGHT:
        return {
          ...state,
          weights: state.weights.filter(weight => weight.id !== action.payload)
        };
      case UPDATE_WEIGHT:
        return {
          ...state,
          weights: state.weights.map(weight =>
            weight.id === action.payload.id ? action.payload : weight
          )
        };
      default:
        return state;
    }
  };

  export default weightReducer;
