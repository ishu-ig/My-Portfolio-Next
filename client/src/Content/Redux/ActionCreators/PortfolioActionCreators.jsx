import { CREATE_PORTFOLIO, DELETE_PORTFOLIO, GET_PORTFOLIO, UPDATE_PORTFOLIO } from "../Constants"

export function createPortfolio(data) {
    return {
        type: CREATE_PORTFOLIO,
        payload: data
    }
}

export function getPortfolio() {
    return {
        type: GET_PORTFOLIO
    }
}

export function updatePortfolio(data) {
    return {
        type: UPDATE_PORTFOLIO,
        payload: data
    }
}

export function deletePortfolio(data) {
    return {
        type: DELETE_PORTFOLIO,
        payload: data
    }
}