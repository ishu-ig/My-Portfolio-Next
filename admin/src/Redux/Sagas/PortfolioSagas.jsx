import { put, takeEvery } from "redux-saga/effects";
import { CREATE_PORTFOLIO, CREATE_PORTFOLIO_RED, DELETE_PORTFOLIO, DELETE_PORTFOLIO_RED, GET_PORTFOLIO, GET_PORTFOLIO_RED, UPDATE_PORTFOLIO, UPDATE_PORTFOLIO_RED } from "../Constants"
// import { createRecord, deleteRecord, getRecord, updateRecord } from "./Service/ApiCallingService"
import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    // let response = yield createRecord("portfolio", action.payload)
    let response = yield createMultipartRecord("portfolio", action.payload)
    yield put({ type: CREATE_PORTFOLIO_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("portfolio")
    yield put({ type: GET_PORTFOLIO_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    // yield updateRecord("portfolio", action.payload)
    // yield put({ type: UPDATE_PORTFOLIO_RED, payload: action.payload })
    let response = yield updateMultipartRecord("portfolio", action.payload)
    yield put({ type: UPDATE_PORTFOLIO_RED, payload: response.data })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("portfolio", action.payload)
    yield put({ type: DELETE_PORTFOLIO_RED, payload: action.payload })
}


export default function* portfolioSagas() {      
    yield takeEvery(CREATE_PORTFOLIO, createSaga)    //watcher saga
    yield takeEvery(GET_PORTFOLIO, getSaga)          //watcher saga
    yield takeEvery(UPDATE_PORTFOLIO, updateSaga)    //watcher saga
    yield takeEvery(DELETE_PORTFOLIO, deleteSaga)    //watcher saga
}