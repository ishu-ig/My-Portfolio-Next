import { put, takeEvery } from "redux-saga/effects";
import { CREATE_CERTIFICATE, CREATE_CERTIFICATE_RED, DELETE_CERTIFICATE, DELETE_CERTIFICATE_RED, GET_CERTIFICATE, GET_CERTIFICATE_RED, UPDATE_CERTIFICATE, UPDATE_CERTIFICATE_RED } from "../Constants"
// import { createRecord, deleteRecord, getRecord, updateRecord } from "./Service/ApiCallingService"
import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    // let response = yield createRecord("certificate", action.payload)
    let response = yield createMultipartRecord("certificate", action.payload)
    yield put({ type: CREATE_CERTIFICATE_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("certificate")
    yield put({ type: GET_CERTIFICATE_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    // yield updateRecord("certificate", action.payload)
    // yield put({ type: UPDATE_CERTIFICATE_RED, payload: action.payload })
    let response = yield updateMultipartRecord("certificate", action.payload)
    yield put({ type: UPDATE_CERTIFICATE_RED, payload: response.data })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("certificate", action.payload)
    yield put({ type: DELETE_CERTIFICATE_RED, payload: action.payload })
}


export default function* certificateSagas() {      
    yield takeEvery(CREATE_CERTIFICATE, createSaga)    //watcher saga
    yield takeEvery(GET_CERTIFICATE, getSaga)          //watcher saga
    yield takeEvery(UPDATE_CERTIFICATE, updateSaga)    //watcher saga
    yield takeEvery(DELETE_CERTIFICATE, deleteSaga)    //watcher saga
}