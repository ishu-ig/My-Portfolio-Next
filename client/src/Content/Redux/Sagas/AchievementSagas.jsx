import { put, takeEvery, call } from "redux-saga/effects";

import {
    CREATE_ACHIEVEMENT,
    CREATE_ACHIEVEMENT_RED,
    DELETE_ACHIEVEMENT,
    DELETE_ACHIEVEMENT_RED,
    GET_ACHIEVEMENT,
    GET_ACHIEVEMENT_RED,
    UPDATE_ACHIEVEMENT,
    UPDATE_ACHIEVEMENT_RED
} from "../Constants";

import {
    createRecord,
    deleteRecord,
    getRecord,
    updateRecord
} from "./Service/ApiCallingService";

function* createSaga(action) {
    try {
        let response = yield call(
            createRecord,
            "achievement",
            action.payload
        );

        yield put({
            type: CREATE_ACHIEVEMENT_RED,
            payload: response
        });

    } catch (error) {
        console.log(error);
    }
}

function* getSaga() {
    try {
        let response = yield call(
            getRecord,
            "achievement"
        );

        yield put({
            type: GET_ACHIEVEMENT_RED,
            payload: response
        });

    } catch (error) {
        console.log(error);
    }
}

function* updateSaga(action) {
    try {
        let response = yield call(
            updateRecord,
            "achievement",
            action.payload
        );

        yield put({
            type: UPDATE_ACHIEVEMENT_RED,
            payload: response
        });

    } catch (error) {
        console.log(error);
    }
}

function* deleteSaga(action) {
    try {
        yield call(
            deleteRecord,
            "achievement",
            action.payload
        );

        yield put({
            type: DELETE_ACHIEVEMENT_RED,
            payload: action.payload
        });

    } catch (error) {
        console.log(error);
    }
}

export default function* achievementSagas() {
    yield takeEvery(CREATE_ACHIEVEMENT, createSaga);
    yield takeEvery(GET_ACHIEVEMENT, getSaga);
    yield takeEvery(UPDATE_ACHIEVEMENT, updateSaga);
    yield takeEvery(DELETE_ACHIEVEMENT, deleteSaga);
}