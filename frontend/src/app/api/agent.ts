import axios, {AxiosError, AxiosResponse} from "axios";
import {toast} from "react-toastify";
import {router} from "../router/Routes.tsx";

const sleep = () => new Promise(resolve => setTimeout(resolve, 200))

axios.defaults.baseURL = "http://localhost:5000/Backend"
axios.defaults.withCredentials = true

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async response => {
    await sleep()
    return response
}, (error: AxiosError) => {
    const {data, status} = error.response as AxiosResponse
    switch (status) {
        case 400:
            if (data.error) {
                const modelStateErrors: string[] = []
                for (const key in data.error) {
                    if (data.error[key]) {
                        modelStateErrors.push(data.error[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title)
            break;
        case 401:
            toast.error(data.title)
            break;
        case 500:
            router.navigate("/server-error", {state: {error: data}})
            break;
        default:
            break;
    }
    return Promise.reject(error.response)
})

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    list: () => requests.get("/Products"),
    details: (id: number) => requests.get(`/Products/${id}`),
}

const TestErrors = {
    get400Error: () => requests.get("/Bug/bad-request"),
    get401Error: () => requests.get("/Bug/unauthorized"),
    get404Error: () => requests.get("/Bug/not-found"),
    get500Error: () => requests.get("/Bug/server-error"),
    getValidationError: () => requests.get("/Bug/validation-error"),
}

const Basket = {
    get: () => requests.get("/Basket"),
    addItem: (productId: number, quantity = 1) => requests.post(`/Basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`/Basket?productId=${productId}&quantity=${quantity}`)
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
}

export default agent;