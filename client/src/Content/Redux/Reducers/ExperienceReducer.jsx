import { CREATE_EXPERIENCE_RED, DELETE_EXPERIENCE_RED, GET_EXPERIENCE_RED, UPDATE_EXPERIENCE_RED } from "../Constants"
export default function ExperienceReducer(state=[], action) {
    switch (action.type) {
        case CREATE_EXPERIENCE_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_EXPERIENCE_RED:
            return action.payload

        case UPDATE_EXPERIENCE_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].jobTitle = action.payload.jobTitle
            state[index].companyName = action.payload.companyName
            state[index].startDate = action.payload.startDate
            state[index].endDate = action.payload.endDate
            state[index].active = action.payload.active
            return state

        case DELETE_EXPERIENCE_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
