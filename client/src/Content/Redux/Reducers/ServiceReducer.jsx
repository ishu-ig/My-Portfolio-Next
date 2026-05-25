import { CREATE_SERVICE_RED, DELETE_SERVICE_RED, GET_SERVICE_RED, UPDATE_SERVICE_RED } from "../Constants"
export default function ServiceReducer(state=[], action) {
    switch (action.type) {
        case CREATE_SERVICE_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_SERVICE_RED:
            return action.payload

        case UPDATE_SERVICE_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].name = action.payload.name
            state[index].short = action.payload.short
            state[index].shortescription = action.payload.shortescription
            state[index].longDescription = action.payload.longDescription
            state[index].price = action.payload.price
            state[index].icon = action.payload.icon
            state[index].duration = action.payload.duration
            state[index].category = action.payload.category
            state[index].total = action.payload.total
            return state

        case DELETE_SERVICE_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
