import {
    CREATE_SKILLCATEGORY_RED,
    GET_SKILLCATEGORY_RED,
    UPDATE_SKILLCATEGORY_RED,
    DELETE_SKILLCATEGORY_RED
} from "../Constants";

export default function SkillCategoryReducer(state = [], action) {
    switch (action.type) {

        case CREATE_SKILLCATEGORY_RED:
            if (action.payload && action.payload._id) {
                let newState = [...state];
                newState.unshift(action.payload);
                return newState;
            }
            return state;

        case GET_SKILLCATEGORY_RED:
            return Array.isArray(action.payload) ? action.payload : state;

        case UPDATE_SKILLCATEGORY_RED:
            if (!action.payload || !action.payload._id) return state;
            return state.map(item =>
                item._id === action.payload._id
                    ? action.payload
                    : item
            );

        case DELETE_SKILLCATEGORY_RED:
            if (!action.payload || !action.payload._id) return state;
            return state.filter(
                item => item._id !== action.payload._id
            );

        default:
            return state;
    }
}