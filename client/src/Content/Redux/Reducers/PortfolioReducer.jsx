import { CREATE_PORTFOLIO_RED, DELETE_PORTFOLIO_RED, GET_PORTFOLIO_RED, UPDATE_PORTFOLIO_RED } from "../Constants"
export default function PortfolioReducer(state=[], action) {
    switch (action.type) {
        case CREATE_PORTFOLIO_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_PORTFOLIO_RED:
            return action.payload

        case UPDATE_PORTFOLIO_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].name = action.payload.name
            state[index].pic = action.payload.pic
            state[index].shortDescription = action.payload.shortDescription
            state[index].londDescription = action.payload.londDescription
            state[index].tech = action.payload.tech
            state[index].category = action.payload.category
            state[index].liveUrl = action.payload.liveUrl
            state[index].githubUrl = action.payload.githubUrl
            state[index].active = action.payload.active
            return state

        case DELETE_PORTFOLIO_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
