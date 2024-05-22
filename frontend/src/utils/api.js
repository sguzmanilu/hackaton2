import axios from "axios";

const LOCAL = 'LOCAL'
const DEV = 'DEV'
const PROD = 'PROD'

const environ = process.env.REACT_APP_BUILD_ENV || LOCAL

const HOST = environ === LOCAL ? 'http://localhost:5000/api/' : // LOCAL
            environ === DEV ? 'https://1nj1bc90t9.execute-api.us-east-1.amazonaws.com/dev/api/' : // DESARROLLO
            environ === PROD ? '' : /* PRODUCCION */ ''

class Api {
    async Get(uri, params = null) {
        const urlParameters =
            params != null
                ? "?" +
                Object.keys(params)
                    .map(
                        (k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])
                    )
                    .join("&")
                : "";
        const endpoint = `${HOST}${uri}${params === null ? "" : urlParameters}`;
        const storage = localStorage.getItem("user");
        const token = JSON.parse(storage || "{}").token;
        const request = await axios.get(endpoint, { headers: { ...(token ? { Authorization:  `Token ${token}` } : {}) } })
        return request;
    }

    async Post(uri, formData) {
        const storage = localStorage.getItem("user");
        const token = JSON.parse(storage || "{}").token;
        const request = await axios.post(`${HOST}${uri}`, formData, { headers: { ...(token ? { Authorization:  `Token ${token}` } : {}) } });
        return request;
    }

    async Put(uri, formData) {
        const storage = localStorage.getItem("user");
        const token = JSON.parse(storage || "{}").token;
        const request = await axios.put(`${HOST}${uri}`, formData, { headers: { ...(token ? { Authorization:  `Token ${token}` } : {}) } });
        return request;
    }

    async Delete(uri) {
        const storage = localStorage.getItem("user");
        const token = JSON.parse(storage || "{}").token;
        const request = await axios.delete(`${HOST}${uri}`, { headers: { ...(token ? { Authorization:  `Token ${token}` } : {}) } });
        return request;
    }
}

export default new Api();
