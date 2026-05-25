import { CREATE_EDUCATION, DELETE_EDUCATION, GET_EDUCATION, UPDATE_EDUCATION } from "../Constants"

export function createEducation(data) {
    return {
        type: CREATE_EDUCATION,
        payload: data
    }
}

export function getEducation() {
    return {
        type: GET_EDUCATION
    }
}

export function updateEducation(data) {
    return {
        type: UPDATE_EDUCATION,
        payload: data
    }
}

export function deleteEducation(data) {
    return {
        type: DELETE_EDUCATION,
        payload: data
    }
}