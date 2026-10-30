import {
    CREATE_PROJECTCATEGORY_RED,
    GET_PROJECTCATEGORY_RED,
    UPDATE_PROJECTCATEGORY_RED,
    DELETE_PROJECTCATEGORY_RED
} from "../Constants";

export default function ProjectCategoryReducer(state = [], action) {
    switch (action.type) {

        case CREATE_PROJECTCATEGORY_RED:
            if (action.payload && action.payload._id) {
                let newState = [...state];
                newState.unshift(action.payload);
                return newState;
            }
            return state;

        case GET_PROJECTCATEGORY_RED:
            return Array.isArray(action.payload) ? action.payload : state;

        case UPDATE_PROJECTCATEGORY_RED:
            if (!action.payload || !action.payload._id) return state;
            return state.map(item =>
                item._id === action.payload._id
                    ? action.payload
                    : item
            );

        case DELETE_PROJECTCATEGORY_RED:
            if (!action.payload || !action.payload._id) return state;
            return state.filter(
                item => item._id !== action.payload._id
            );

        default:
            return state;
    }
}