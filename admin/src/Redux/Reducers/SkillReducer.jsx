import { CREATE_SKILL_RED, DELETE_SKILL_RED, GET_SKILL_RED, UPDATE_SKILL_RED } from "../Constants"
export default function SkillReducer(state=[], action) {
    switch (action.type) {
        case CREATE_SKILL_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_SKILL_RED:
            return action.payload

        case UPDATE_SKILL_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].name = action.payload.name
            state[index].description = action.payload.description
            state[index].level = action.payload.level
            state[index].active = action.payload.active
            return state

        case DELETE_SKILL_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
