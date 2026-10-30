import {
    CREATE_PROJECTCATEGORY,
    GET_PROJECTCATEGORY,
    UPDATE_PROJECTCATEGORY,
    DELETE_PROJECTCATEGORY
} from "../Constants";

export function createProjectCategory(data) {
    return {
        type: CREATE_PROJECTCATEGORY,
        payload: data
    };
}

export function getProjectCategory() {
    return {
        type: GET_PROJECTCATEGORY
    };
}

export function updateProjectCategory(data) {
    return {
        type: UPDATE_PROJECTCATEGORY,
        payload: data
    };
}

export function deleteProjectCategory(data) {
    return {
        type: DELETE_PROJECTCATEGORY,
        payload: data
    };
}