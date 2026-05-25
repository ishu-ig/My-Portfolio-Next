import { CREATE_CERTIFICATE_RED, DELETE_CERTIFICATE_RED, GET_CERTIFICATE_RED, UPDATE_CERTIFICATE_RED } from "../Constants"
export default function CertificateReducer(state=[], action) {
    switch (action.type) {
        case CREATE_CERTIFICATE_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_CERTIFICATE_RED:
            return action.payload

        case UPDATE_CERTIFICATE_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].name = action.payload.name
            state[index].pic = action.payload.pic
            state[index].issuedBY = action.payload.issuedBY
            state[index].active = action.payload.active
            return state

        case DELETE_CERTIFICATE_RED:
            console.log("Delete Called")
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
