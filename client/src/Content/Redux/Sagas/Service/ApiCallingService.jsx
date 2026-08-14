const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER;

export async function createRecord(collection, payload) {
    try {
        let response = await fetch(`${BASE_URL}/api/${collection}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
            },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.log(error);
        return { result: "Fail", reason: error.message };
    }
}

export async function createMultipartRecord(collection, payload) {
    try {
        let response = await fetch(`${BASE_URL}/api/${collection}`, {
            method: "POST",
            headers: {
                "authorization": typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
            },
            body: payload
        });
        return await response.json();
    } catch (error) {
        console.log(error);
        return { result: "Fail", reason: error.message };
    }
}

export async function getRecord(collection) {
    try {
        let url = `${BASE_URL}/api/${collection}`;
        if (typeof window !== "undefined") {
            if (collection === "cart" || collection === "wishlist") {
                url = `${BASE_URL}/api/${collection}/${localStorage.getItem("userid")}`;
            } else if (collection === "checkout" && localStorage.getItem("role") === "Buyer") {
                url = `${BASE_URL}/api/${collection}/user/${localStorage.getItem("userid")}`;
            }
        }

        let response = await fetch(url, {
            method: "GET",
            headers: {
                "content-type": "application/json",
            }
        });
        return await response.json();
    } catch (error) {
        console.log(error);
        return { result: "Fail", data: [], reason: error.message };
    }
}

export async function updateRecord(collection, payload) {
    try {
        let response = await fetch(`${BASE_URL}/api/${collection}/${payload._id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
            },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.log(error);
        return { result: "Fail", reason: error.message };
    }
}

export async function updateMultipartRecord(collection, payload) {
    try {
        let response = await fetch(`${BASE_URL}/api/${collection}/${payload.get('_id')}`, {
            method: "PUT",
            headers: {
                "authorization": typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
            },
            body: payload
        });
        return await response.json();
    } catch (error) {
        console.log(error);
        return { result: "Fail", reason: error.message };
    }
}

export async function deleteRecord(collection, payload) {
    try {
        let response = await fetch(`${BASE_URL}/api/${collection}/${payload._id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "authorization": typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
            }
        });
        return await response.json();
    } catch (error) {
        console.log(error);
        return { result: "Fail", reason: error.message };
    }
}