import axios, {AxiosError, AxiosResponse} from "axios";
import {toast} from "react-toastify";
import {router} from "../router/Routes.tsx";
import {PaginatedResponse} from "../model/pagination.ts";
import {store} from "../store/configureStore.ts";

const sleep = () => new Promise(resolve => setTimeout(resolve, 200))

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
axios.defaults.withCredentials = true

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

axios.interceptors.response.use(async response => {
    if (import.meta.env.DEV) {
        await sleep()
    }
    const pagination = response.headers["pagination"]
    if (pagination) {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination))
    }
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
        case 403:
            toast.error("You are not allowed to do that!")
            break
        case 500:
            router.navigate("/server-error", {state: {error: data}})
            break;
        default:
            break;
    }
    return Promise.reject(error.response)
})

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
    postForm: (url: string, data: FormData) => axios.post(url, data, {
        headers: {"Content-type": "multipart/form-data"}
    }).then(responseBody),
    putForm: (url: string, data: FormData) => axios.put(url, data, {
        headers: {"Content-type": "multipart/form-data"}
    }).then(responseBody),
}

function createFormData(item: any) {
    const formData = new FormData();
    for (const key in item) {
        formData.append(key, item[key])
    }
    return formData
}

const Admin = {
    createProduct: (product: any) => requests.postForm("/Product", createFormData(product)),
    updateProduct: (product: any) => requests.putForm("/Product", createFormData(product)),
    deleteProduct: (id: number) => requests.delete(`/Product/${id}`)
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get("/Product/list", params),
    details: (id: number) => requests.get(`/Product/${id}`),
    fetchFilters: () => requests.get("/Product/filters"),
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

const Account = {
    login: (values: any) => requests.post("/Account/login", values),
    register: (values: any) => requests.post("/Account/register", values),
    currentUser: () => requests.get("/Account/currentUser"),
    fetchAddress: () => requests.get("/Account/savedAddress")
}

const Order = {
    list: () => requests.get("/Order"),
    fetch: (id: number) => requests.get(`/Order/${id}`),
    create: (values: any) => requests.post("/Order", values)
}

const Payment = {
    createPaymentIntent: () => requests.post("/Payment", {})
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Order,
    Payment,
    Admin,
}

export default agent;