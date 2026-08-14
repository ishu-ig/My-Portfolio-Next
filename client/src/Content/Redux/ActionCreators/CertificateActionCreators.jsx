import { CREATE_CERTIFICATE, DELETE_CERTIFICATE, GET_CERTIFICATE, UPDATE_CERTIFICATE } from "../Constants"

export function createCertificate(data) {
    return {
        type: CREATE_CERTIFICATE,
        payload: data
    }
}

export function getCertificate() {
    return {
        type: GET_CERTIFICATE
    }
}

export function updateCertificate(data) {
    return {
        type: UPDATE_CERTIFICATE,
        payload: data
    }
}

export function deleteCertificate(data) {
    return {
        type: DELETE_CERTIFICATE,
        payload: data
    }
}