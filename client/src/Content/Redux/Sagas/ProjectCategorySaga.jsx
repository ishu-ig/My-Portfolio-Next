import { put, takeEvery } from "redux-saga/effects";

import {
  CREATE_PROJECTCATEGORY,
  CREATE_PROJECTCATEGORY_RED,
  GET_PROJECTCATEGORY,
  GET_PROJECTCATEGORY_RED,
  UPDATE_PROJECTCATEGORY,
  UPDATE_PROJECTCATEGORY_RED,
  DELETE_PROJECTCATEGORY,
  DELETE_PROJECTCATEGORY_RED,
} from "../Constants";

import {
  createRecord,
  deleteRecord,
  getRecord,
  updateRecord,
} from "./Service/ApiCallingService";

function* createSaga(action) {
  try {
    let response = yield createRecord("projectcategory", action.payload);
    if (response && response.data) {
      yield put({
        type: CREATE_PROJECTCATEGORY_RED,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function* getSaga() {
  try {
    let response = yield getRecord("projectcategory");
    if (response && response.data) {
      yield put({
        type: GET_PROJECTCATEGORY_RED,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function* updateSaga(action) {
  try {
    let response = yield updateRecord("projectcategory", action.payload);
    yield put({
      type: UPDATE_PROJECTCATEGORY_RED,
      payload: (response && response.data) ? response.data : action.payload,
    });
  } catch (error) {
    console.log(error);
  }
}

function* deleteSaga(action) {
  try {
    yield deleteRecord("projectcategory", action.payload);
    yield put({
      type: DELETE_PROJECTCATEGORY_RED,
      payload: action.payload,
    });
  } catch (error) {
    console.log(error);
  }
}

export default function* projectCategorySagas() {
  yield takeEvery(CREATE_PROJECTCATEGORY, createSaga);
  yield takeEvery(GET_PROJECTCATEGORY, getSaga);
  yield takeEvery(UPDATE_PROJECTCATEGORY, updateSaga);
  yield takeEvery(DELETE_PROJECTCATEGORY, deleteSaga);
}
