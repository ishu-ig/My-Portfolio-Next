function getBaseUrl() {
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        return process.env.NEXT_PUBLIC_BACKEND_SERVER?.includes("localhost") 
            ? process.env.NEXT_PUBLIC_BACKEND_SERVER 
            : "http://localhost:8000";
    }
    return process.env.NEXT_PUBLIC_BACKEND_SERVER || "https://admin.ishaanportfolio.com";
}

export async function createRecord(collection, payload) {
    try {
        const BASE_URL = getBaseUrl();
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
        const BASE_URL = getBaseUrl();
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
        const BASE_URL = getBaseUrl();
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
        const BASE_URL = getBaseUrl();
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
        const BASE_URL = getBaseUrl();
        const id = (typeof FormData !== "undefined" && payload instanceof FormData)
            ? payload.get('_id')
            : payload._id;
        let response = await fetch(`${BASE_URL}/api/${collection}/${id}`, {
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
        const BASE_URL = getBaseUrl();
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