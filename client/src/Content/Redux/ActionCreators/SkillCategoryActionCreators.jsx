import {
    CREATE_SKILLCATEGORY,
    GET_SKILLCATEGORY,
    UPDATE_SKILLCATEGORY,
    DELETE_SKILLCATEGORY
} from "../Constants";

export function createSkillCategory(data) {
    return {
        type: CREATE_SKILLCATEGORY,
        payload: data
    };
}

export function getSkillCategory() {
    return {
        type: GET_SKILLCATEGORY
    };
}

export function updateSkillCategory(data) {
    return {
        type: UPDATE_SKILLCATEGORY,
        payload: data
    };
}

export function deleteSkillCategory(data) {
    return {
        type: DELETE_SKILLCATEGORY,
        payload: data
    };
}