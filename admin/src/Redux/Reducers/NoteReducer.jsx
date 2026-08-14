import {
    CREATE_NOTE_RED,
    DELETE_NOTE_RED,
    GET_NOTE_RED,
    UPDATE_NOTE_RED,
} from "../Constants";

export default function NoteReducer(state = [], action) {
    switch (action.type) {
        case CREATE_NOTE_RED: {
            const record = action.payload?.data ?? action.payload;
            return [record, ...state];
        }

        case GET_NOTE_RED:
            return action.payload?.data ?? action.payload ?? [];

        case UPDATE_NOTE_RED: {
            const record = action.payload?.data ?? action.payload;
            return state.map((item) => (item._id === record._id ? record : item));
        }

        case DELETE_NOTE_RED:
            return state.filter((x) => x._id !== action.payload._id);

        default:
            return state;
    }
}
