import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../models/Pagination";

axios.defaults.baseURL = 'http://localhost:5000/api/'
axios.defaults.withCredentials = true

const responseBody = (response: AxiosResponse) => response.data

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000))

axios.interceptors.response.use(async response => {
    await sleep()
    const pagination = response.headers["pagination"]
    if (pagination) {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination))
        return response
    }
    return response
}, (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse
    switch (status) {
        case 400:
            toast.error(data)
            break
        case 401:
            toast.error(data.title)
            break
        case 404:
            toast.error(data.title)
            break
        case 500:
            toast.error(data.title)
            break
        default:
            toast.error("Technical error")
    }
    return Promise.reject(error.response)
})

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const catalog = {
    productsList: (params: URLSearchParams) => requests.get('Products', params),
    productDetails: (id: number) => requests.get(`Products/${id}`),
    fetchFilters: () => requests.get('Products/filters')
}

const basket = {
    getBasket: () => requests.get('Basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`Basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`Basket?productId=${productId}&quantity=${quantity}`)
}

const testErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-errors'),
}

const agent = {
    catalog,
    testErrors,
    basket
}

export default agent