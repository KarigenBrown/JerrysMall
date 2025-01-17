import axios, {AxiosResponse} from "axios";

axios.defaults.baseURL = "http://localhost:5000/Backend"

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    list: () => requests.get("/Products"),
    detail: (id: number) => requests.get(`/Products/${id}`),
}

const TestErrors = {
    get400Error: () => requests.get("/Bug/bad-request"),
    get401Error: () => requests.get("/Bug/unauthorized"),
    get404Error: () => requests.get("/Bug/not-found"),
    get500Error: () => requests.get("/Bug/server-error"),
    getValidationError: () => requests.get("/Bug/validation-error"),
}

const agent = {
    Catalog,
    TestErrors,
}

export default agent;