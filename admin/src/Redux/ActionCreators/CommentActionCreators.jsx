import { CREATE_COMMENT, DELETE_COMMENT, GET_COMMENT, UPDATE_COMMENT } from "../Constants"

export function createComment(data) {
    return {
        type: CREATE_COMMENT,
        payload: data
    }
}

export function getComment() {
    return {
        type: GET_COMMENT
    }
}

export function updateComment(data) {
    return {
        type: UPDATE_COMMENT,
        payload: data
    }
}

export function deleteComment(data) {
    return {
        type: DELETE_COMMENT,
        payload: data
    }
}