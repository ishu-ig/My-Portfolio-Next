import { put, takeEvery } from "redux-saga/effects";

import {
  CREATE_ABOUT,
  CREATE_ABOUT_RED,
  GET_ABOUT,
  GET_ABOUT_RED,
  UPDATE_ABOUT,
  UPDATE_ABOUT_RED,
  DELETE_ABOUT,
  DELETE_ABOUT_RED,
} from "../Constants";

import {
  createMultipartRecord,
  deleteRecord,
  getRecord,
  updateMultipartRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  let response = yield createMultipartRecord("about", action.payload);

  yield put({
    type: CREATE_ABOUT_RED,
    payload: response.data,
  });
}

function* getSaga() {
  let response = yield getRecord("about");

  yield put({
    type: GET_ABOUT_RED,
    payload: response.data,
  });
}

function* updateSaga(action) {
  let response = yield updateMultipartRecord("about", action.payload);

  yield put({
    type: UPDATE_ABOUT_RED,
    payload: response.data,
  });
}

function* deleteSaga(action) {
  yield deleteRecord("about", action.payload);

  yield put({
    type: DELETE_ABOUT_RED,
    payload: action.payload,
  });
}

export default function* aboutSagas() {
  yield takeEvery(CREATE_ABOUT, createSaga);
  yield takeEvery(GET_ABOUT, getSaga);
  yield takeEvery(UPDATE_ABOUT, updateSaga);
  yield takeEvery(DELETE_ABOUT, deleteSaga);
}
