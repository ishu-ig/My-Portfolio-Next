import { CREATE_COMMENT_RED, DELETE_COMMENT_RED, GET_COMMENT_RED, UPDATE_COMMENT_RED } from "../Constants"
export default function CommentReducer(state=[], action) {
    switch (action.type) {
        case CREATE_COMMENT_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_COMMENT_RED:
            return action.payload

        case UPDATE_COMMENT_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].active = action.payload.active
            return state

        case DELETE_COMMENT_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
