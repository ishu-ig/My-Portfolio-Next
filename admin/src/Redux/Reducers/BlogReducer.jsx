import { CREATE_BLOG_RED, DELETE_BLOG_RED, GET_BLOG_RED, UPDATE_BLOG_RED } from "../Constants"
export default function BlogReducer(state=[], action) {
    switch (action.type) {
        case CREATE_BLOG_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_BLOG_RED:
            return action.payload

        case UPDATE_BLOG_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].name = action.payload.name
            state[index].short = action.payload.short
            state[index].shortescription = action.payload.shortescription
            state[index].longDescription = action.payload.longDescription
            state[index].pic = action.payload.pic
            
            return state

        case DELETE_BLOG_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
