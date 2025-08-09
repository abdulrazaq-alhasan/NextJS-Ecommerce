const { default: axiosClient } = require("./axiosClient");

const getLatestProducts = () => axiosClient.get('/products?populate=*')
const getProductById = (documentId) => axiosClient.get(`/products/${documentId}?populate=*`)



export default {
    getLatestProducts,
    getProductById,
}