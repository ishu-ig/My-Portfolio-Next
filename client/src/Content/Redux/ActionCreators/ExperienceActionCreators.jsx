import { CREATE_EXPERIENCE, DELETE_EXPERIENCE, GET_EXPERIENCE, UPDATE_EXPERIENCE } from "../Constants"

export function createExperience(data) {
    return {
        type: CREATE_EXPERIENCE,
        payload: data
    }
}

export function getExperience() {
    return {
        type: GET_EXPERIENCE
    }
}

export function updateExperience(data) {
    return {
        type: UPDATE_EXPERIENCE,
        payload: data
    }
}

export function deleteExperience(data) {
    return {
        type: DELETE_EXPERIENCE,
        payload: data
    }
}