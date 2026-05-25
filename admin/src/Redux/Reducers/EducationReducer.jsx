import { CREATE_EDUCATION_RED, DELETE_EDUCATION_RED, GET_EDUCATION_RED, UPDATE_EDUCATION_RED } from "../Constants"
export default function EducationReducer(state=[], action) {
    switch (action.type) {
        case CREATE_EDUCATION_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_EDUCATION_RED:
            return action.payload

        case UPDATE_EDUCATION_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].degreeName = action.payload.degreeName
            state[index].instituteName = action.payload.instituteName
            state[index].startDate = action.payload.startDate
            state[index].endDate = action.payload.endDate
            state[index].cgpa = action.payload.cgpa
            state[index].active = action.payload.active
            return state

        case DELETE_EDUCATION_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
