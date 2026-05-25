import { put, takeEvery } from "redux-saga/effects";
import { CREATE_EXPERIENCE, CREATE_EXPERIENCE_RED, DELETE_EXPERIENCE, DELETE_EXPERIENCE_RED, GET_EXPERIENCE, GET_EXPERIENCE_RED, UPDATE_EXPERIENCE, UPDATE_EXPERIENCE_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Service/ApiCallingService"
// import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createRecord("experience", action.payload)
    // let response = yield createMultipartRecord("experience", action.payload)
    yield put({ type: CREATE_EXPERIENCE_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("experience")
    yield put({ type: GET_EXPERIENCE_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateRecord("experience", action.payload)
    // yield updateMultipartRecord("experience", action.payload)
    yield put({ type: UPDATE_EXPERIENCE_RED, payload: action.payload })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("experience", action.payload)
    yield put({ type: DELETE_EXPERIENCE_RED, payload: action.payload })
}


export default function* experienceSagas() {      
    yield takeEvery(CREATE_EXPERIENCE, createSaga)    //watcher saga
    yield takeEvery(GET_EXPERIENCE, getSaga)          //watcher saga
    yield takeEvery(UPDATE_EXPERIENCE, updateSaga)    //watcher saga
    yield takeEvery(DELETE_EXPERIENCE, deleteSaga)    //watcher saga
}