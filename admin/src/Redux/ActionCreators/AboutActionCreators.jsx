import {
    CREATE_ABOUT,
    GET_ABOUT,
    UPDATE_ABOUT,
    DELETE_ABOUT
} from "../Constants";

export function createAbout(data) {
    return {
        type: CREATE_ABOUT,
        payload: data
    };
}

export function getAbout() {
    return {
        type: GET_ABOUT
    };
}

export function updateAbout(data) {
    return {
        type: UPDATE_ABOUT,
        payload: data
    };
}

export function deleteAbout(data) {
    return {
        type: DELETE_ABOUT,
        payload: data
    };
}