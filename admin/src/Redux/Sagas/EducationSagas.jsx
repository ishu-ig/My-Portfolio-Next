import { put, takeEvery } from "redux-saga/effects";
import { CREATE_EDUCATION, CREATE_EDUCATION_RED, DELETE_EDUCATION, DELETE_EDUCATION_RED, GET_EDUCATION, GET_EDUCATION_RED, UPDATE_EDUCATION, UPDATE_EDUCATION_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Service/ApiCallingService"
// import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createRecord("education", action.payload)
    // let response = yield createMultipartRecord("education", action.payload)
    yield put({ type: CREATE_EDUCATION_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("education")
    yield put({ type: GET_EDUCATION_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateRecord("education", action.payload)
    yield put({ type: UPDATE_EDUCATION_RED, payload: action.payload })
    // let response = yield updateMultipartRecord("education", action.payload)
    // yield put({ type: UPDATE_EDUCATION_RED, payload: response.data })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("education", action.payload)
    yield put({ type: DELETE_EDUCATION_RED, payload: action.payload })
}


export default function* educationSagas() {      
    yield takeEvery(CREATE_EDUCATION, createSaga)    //watcher saga
    yield takeEvery(GET_EDUCATION, getSaga)          //watcher saga
    yield takeEvery(UPDATE_EDUCATION, updateSaga)    //watcher saga
    yield takeEvery(DELETE_EDUCATION, deleteSaga)    //watcher saga
}