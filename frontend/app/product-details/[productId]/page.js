"use client";

import BreadCrumb from "@/app/_componets/BreadCrumb";
import { CartContext } from "@/app/_context/CartContext";
import api from "@/app/_utils/api";
import { useUser } from "@clerk/nextjs";
import { AlertOctagon, BadgeCheck, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { user } = useUser()
  const router = useRouter()
  const productId = params?.productId;
  const apiUrl = "http://localhost:1337";

  const { cart, setCart } = useContext(CartContext)


  const getProductDetails = async () => {
    try {
      setLoading(true);
      const response = await api.getProductById(productId);
      console.log("Product Response:", response);
      setProduct(response.data.data)
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  function handleAddToCart() {
    if (!user) {
      router.push('/sign-in')
    } else {
      const data = {
        data: {
          username: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          products: [product?.id]
        }
      }
      api.addToCart(data).then(res => {
        console.log(res?.data?.data)
        setCart(c => [...c, { id: res?.data?.data?.id, product }])
      })
        .catch(err => console.log('error', err?.response?.data || err?.message || err))
    }
  }

  useEffect(() => {
    getProductDetails();
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found</div>;



  return (
    <div className="w-fit mx-40 mt-25">
      <BreadCrumb product={product} />
      <div className="flex flex-col gap-10 mt-30 sm:flex-row sm:items-start mx-auto max-w-6xl">
        {/* Left - Image */}
        <div className="flex-shrink-0">
          <Image
            priority
            src={`${apiUrl}${product.banner.url}`}
            alt={product?.title}
            width={400}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>

        {/* Right - Details */}
        <div className="flex-1">
          <h2 className="text-[20px] font-semibold">{product.title}</h2>
          <h2 className="text-[15px] text-gray-400">{product.category}</h2>
          <h2 className="text-[11px] mt-2 font-medium">Description</h2>

          <p className="text-[14px] text-gray-600 mt-1">
            {product?.description?.[0]?.children?.[0]?.text}
          </p>

          <h2 className="text-[11px] text-gray-500 flex gap-2 mt-4 items-center">
            {product.instantDelivery ? (
              <BadgeCheck className="w-5 h-5 text-green-500" />
            ) : (
              <AlertOctagon className="w-5 h-5 text-red-500" />
            )}
            Eligible For Instant Delivery
          </h2>

          <h2 className="text-[24px] text-primary mt-4 font-bold">$ {product.price}</h2>

          <button onClick={() => handleAddToCart()} className='mt-3 flex gap-2 p-2 text-white rounded-lg bg-teal-700 hover:bg-teal-600'><ShoppingCart /> Add To Cart</button>

        </div>
      </div>


    </div>
  );
}

export default ProductDetails;