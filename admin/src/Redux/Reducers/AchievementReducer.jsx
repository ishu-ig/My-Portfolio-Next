import { CREATE_ACHIEVEMENT_RED, DELETE_ACHIEVEMENT_RED, GET_ACHIEVEMENT_RED, UPDATE_ACHIEVEMENT_RED } from "../Constants"
export default function AchievementReducer(state=[], action) {
    switch (action.type) {
        case CREATE_ACHIEVEMENT_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_ACHIEVEMENT_RED:
            return action.payload

        case UPDATE_ACHIEVEMENT_RED:
    return state.map(item =>
        item._id === action.payload._id
            ? action.payload
            : item
    )

        case DELETE_ACHIEVEMENT_RED:
            console.log("Delete Called")
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
