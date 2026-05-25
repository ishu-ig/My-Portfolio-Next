import { put, takeEvery } from "redux-saga/effects";
import { GET_RESUME, GET_RESUME_RED } from "../Constants";
import { getRecord } from "./Service/ApiCallingService";

function* getSaga() {
    try {
        // getRecord returns { result: 'Done', data: resume }
        const response = yield getRecord("resume");

        yield put({
            type: GET_RESUME_RED,
            payload: response?.data || null,  // SAFE ACCESS
        });

    } catch (error) {
        console.error("Resume Saga Error:", error);

        yield put({
            type: GET_RESUME_RED,
            payload: null
        });
    }
}

export default function* ResumeSagas() {
    yield takeEvery(GET_RESUME, getSaga);
}
