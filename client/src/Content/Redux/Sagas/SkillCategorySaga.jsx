import { put, takeEvery } from "redux-saga/effects";

import {
  CREATE_SKILLCATEGORY,
  CREATE_SKILLCATEGORY_RED,
  GET_SKILLCATEGORY,
  GET_SKILLCATEGORY_RED,
  UPDATE_SKILLCATEGORY,
  UPDATE_SKILLCATEGORY_RED,
  DELETE_SKILLCATEGORY,
  DELETE_SKILLCATEGORY_RED,
} from "../Constants";

import {
  createRecord,
  deleteRecord,
  getRecord,
  updateRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  try {
    let response = yield createRecord("skillcategory", action.payload);
    if (response && response.data) {
      yield put({
        type: CREATE_SKILLCATEGORY_RED,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function* getSaga() {
  try {
    let response = yield getRecord("skillcategory");
    if (response && response.data) {
      yield put({
        type: GET_SKILLCATEGORY_RED,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function* updateSaga(action) {
  try {
    let response = yield updateRecord("skillcategory", action.payload);
    yield put({
      type: UPDATE_SKILLCATEGORY_RED,
      payload: (response && response.data) ? response.data : action.payload,
    });
  } catch (error) {
    console.log(error);
  }
}

function* deleteSaga(action) {
  try {
    yield deleteRecord("skillcategory", action.payload);
    yield put({
      type: DELETE_SKILLCATEGORY_RED,
      payload: action.payload,
    });
  } catch (error) {
    console.log(error);
  }
}

export default function* skillCategorySagas() {
  yield takeEvery(CREATE_SKILLCATEGORY, createSaga);
  yield takeEvery(GET_SKILLCATEGORY, getSaga);
  yield takeEvery(UPDATE_SKILLCATEGORY, updateSaga);
  yield takeEvery(DELETE_SKILLCATEGORY, deleteSaga);
}
