import { put, takeEvery } from "redux-saga/effects";
import {
    CREATE_NOTE,
    CREATE_NOTE_RED,
    DELETE_NOTE,
    DELETE_NOTE_RED,
    GET_NOTE,
    GET_NOTE_RED,
    UPDATE_NOTE,
    UPDATE_NOTE_RED,
} from "../Constants";
import {
    createMultipartRecord,
    deleteRecord,
    getRecord,
    updateMultipartRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
    try {
        let response = yield createMultipartRecord("note", action.payload);
        yield put({ type: CREATE_NOTE_RED, payload: response.data });
    } catch (e) {
        console.error(e);
    }
}

function* getSaga() {
    try {
        let response = yield getRecord("note");
        yield put({ type: GET_NOTE_RED, payload: response.data });
    } catch (e) {
        console.error(e);
    }
}

function* updateSaga(action) {
    try {
        let response = yield updateMultipartRecord("note", action.payload);
        yield put({ type: UPDATE_NOTE_RED, payload: response.data });
    } catch (e) {
        console.error(e);
    }
}

function* deleteSaga(action) {
    try {
        yield deleteRecord("note", action.payload);
        yield put({ type: DELETE_NOTE_RED, payload: action.payload });
    } catch (e) {
        console.error(e);
    }
}

export default function* noteSagas() {
    yield takeEvery(CREATE_NOTE, createSaga);
    yield takeEvery(GET_NOTE, getSaga);
    yield takeEvery(UPDATE_NOTE, updateSaga);
    yield takeEvery(DELETE_NOTE, deleteSaga);
}
