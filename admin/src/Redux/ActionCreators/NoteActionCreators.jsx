import { CREATE_NOTE, DELETE_NOTE, GET_NOTE, UPDATE_NOTE } from "../Constants";

export function createNote(data) {
    return {
        type: CREATE_NOTE,
        payload: data,
    };
}

export function getNote() {
    return {
        type: GET_NOTE,
    };
}

export function updateNote(data) {
    return {
        type: UPDATE_NOTE,
        payload: data,
    };
}

export function deleteNote(data) {
    return {
        type: DELETE_NOTE,
        payload: data,
    };
}
