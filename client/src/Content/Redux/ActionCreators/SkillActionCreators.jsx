import { CREATE_SKILL, DELETE_SKILL, GET_SKILL, UPDATE_SKILL } from "../Constants"

export function createSkill(data) {
    return {
        type: CREATE_SKILL,
        payload: data
    }
}

export function getSkill() {
    return {
        type: GET_SKILL
    }
}

export function updateSkill(data) {
    return {
        type: UPDATE_SKILL,
        payload: data
    }
}

export function deleteSkill(data) {
    return {
        type: DELETE_SKILL,
        payload: data
    }
}