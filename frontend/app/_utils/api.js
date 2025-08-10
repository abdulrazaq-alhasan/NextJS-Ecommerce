const { default: axiosClient } = require("./axiosClient");

// Product
const getLatestProducts = () => axiosClient.get('/products?populate=*')
const getProductById = (documentId) => axiosClient.get(`/products/${documentId}?populate=*`)

// Cart
const addToCart = (payload) => axiosClient.post('/carts', payload)
const getUserCartItems = (email) =>
    axiosClient.get(
        `carts?populate[products][populate]=banner&filters[email][$eq]=${email}`
    );

const deleteCartItem = (id) => axiosClient.delete(`/carts/${id}`);

export default {
    getLatestProducts,
    getProductById,
    addToCart,
    getUserCartItems,
    deleteCartItem
}