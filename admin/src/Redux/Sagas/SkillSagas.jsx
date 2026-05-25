import { put, takeEvery } from "redux-saga/effects";
import { CREATE_SKILL, CREATE_SKILL_RED, DELETE_SKILL, DELETE_SKILL_RED, GET_SKILL, GET_SKILL_RED, UPDATE_SKILL, UPDATE_SKILL_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Service/ApiCallingService"
// import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createRecord("skill", action.payload)
    // let response = yield createMultipartRecord("skill", action.payload)
    yield put({ type: CREATE_SKILL_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("skill")
    yield put({ type: GET_SKILL_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateRecord("skill", action.payload)
    yield put({ type: UPDATE_SKILL_RED, payload: action.payload })
    // let response = yield updateMultipartRecord("skill", action.payload)
    // yield put({ type: UPDATE_SKILL_RED, payload: response.data })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("skill", action.payload)
    yield put({ type: DELETE_SKILL_RED, payload: action.payload })
}


export default function* skillSagas() {
    yield takeEvery(CREATE_SKILL, createSaga)    //watcher saga
    yield takeEvery(GET_SKILL, getSaga)          //watcher saga
    yield takeEvery(UPDATE_SKILL, updateSaga)    //watcher saga
    yield takeEvery(DELETE_SKILL, deleteSaga)    //watcher saga
}