import { put, takeEvery } from "redux-saga/effects";
import { CREATE_BLOG, CREATE_BLOG_RED, DELETE_BLOG, DELETE_BLOG_RED, GET_BLOG, GET_BLOG_RED, UPDATE_BLOG, UPDATE_BLOG_RED } from "../Constants"
// import { createRecord, deleteRecord, getRecord, updateRecord } from "./Service/ApiCallingService"
import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    // let response = yield createRecord("blog", action.payload)
    let response = yield createMultipartRecord("blog", action.payload)
    yield put({ type: CREATE_BLOG_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("blog")
    yield put({ type: GET_BLOG_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    // yield updateRecord("blog", action.payload)
    // yield put({ type: UPDATE_BLOG_RED, payload: action.payload })
    let response = yield updateMultipartRecord("blog", action.payload)
    yield put({ type: UPDATE_BLOG_RED, payload: response.data })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("blog", action.payload)
    yield put({ type: DELETE_BLOG_RED, payload: action.payload })
}


export default function* blogSagas() {      
    yield takeEvery(CREATE_BLOG, createSaga)    //watcher saga
    yield takeEvery(GET_BLOG, getSaga)          //watcher saga
    yield takeEvery(UPDATE_BLOG, updateSaga)    //watcher saga
    yield takeEvery(DELETE_BLOG, deleteSaga)    //watcher saga
}