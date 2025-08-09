"use client"

import React, { useEffect, useState } from 'react';
import Product from './Product';
import api from '../_utils/api';

function ProductList() {
    const [products, setProducts] = useState([])
    useEffect(() => {
        getProductsList();
    }, [])
    const getProductsList = () => {
        api.getLatestProducts().then(res => {
            console.log(res.data.data);
            setProducts(res.data.data)
        })
    }
    return (
        <section className="max-w-[85%] m-auto">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-5">Latest Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products?.map(product => (
                        <Product key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProductList; 