import {
    CREATE_ABOUT_RED,
    GET_ABOUT_RED,
    UPDATE_ABOUT_RED,
    DELETE_ABOUT_RED
} from "../Constants";

export default function AboutReducer(state = [], action) {
    switch (action.type) {

        case CREATE_ABOUT_RED:
            let newState = [...state];
            newState.unshift(action.payload);
            return newState;

        case GET_ABOUT_RED:
            return action.payload;

        case UPDATE_ABOUT_RED:
            return state.map(item =>
                item._id === action.payload._id
                    ? action.payload
                    : item
            );

        case DELETE_ABOUT_RED:
            return state.filter(
                item => item._id !== action.payload._id
            );

        default:
            return state;
    }
}