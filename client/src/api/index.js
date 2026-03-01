import axios from "axios";

const BASE = "/api";

export const api = {
  getProducts: (params = {}) =>
    axios.get(`${BASE}/products`, { params }).then((r) => r.data),

  getCategories: () =>
    axios.get(`${BASE}/products/categories`).then((r) => r.data),

  getProduct: (id) =>
    axios.get(`${BASE}/products/${id}`).then((r) => r.data),

  placeOrder: (payload) =>
    axios.post(`${BASE}/orders`, payload).then((r) => r.data),
};
