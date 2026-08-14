import { CREATE_ACHIEVEMENT, DELETE_ACHIEVEMENT, GET_ACHIEVEMENT, UPDATE_ACHIEVEMENT } from "../Constants"

export function createAchievement(data) {
    return {
        type: CREATE_ACHIEVEMENT,
        payload: data
    }
}

export function getAchievement() {
    return {
        type: GET_ACHIEVEMENT
    }
}

export function updateAchievement(data) {
    return {
        type: UPDATE_ACHIEVEMENT,
        payload: data
    }
}

export function deleteAchievement(data) {
    return {
        type: DELETE_ACHIEVEMENT,
        payload: data
    }
}