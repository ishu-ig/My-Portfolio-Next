import { put, takeEvery } from "redux-saga/effects";
import { CREATE_COMMENT, CREATE_COMMENT_RED, DELETE_COMMENT, DELETE_COMMENT_RED, GET_COMMENT, GET_COMMENT_RED, UPDATE_COMMENT, UPDATE_COMMENT_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Service/ApiCallingService"
// import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createRecord("comment", action.payload)
    // let response = yield createMultipartRecord("comment", action.payload)
    yield put({ type: CREATE_COMMENT_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("comment")
    yield put({ type: GET_COMMENT_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateRecord("comment", action.payload)
    // yield updateMultipartRecord("comment", action.payload)
    yield put({ type: UPDATE_COMMENT_RED, payload: action.payload })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("comment", action.payload)
    yield put({ type: DELETE_COMMENT_RED, payload: action.payload })
}


export default function* commentSagas() {      
    yield takeEvery(CREATE_COMMENT, createSaga)    //watcher saga
    yield takeEvery(GET_COMMENT, getSaga)          //watcher saga
    yield takeEvery(UPDATE_COMMENT, updateSaga)    //watcher saga
    yield takeEvery(DELETE_COMMENT, deleteSaga)    //watcher saga
}