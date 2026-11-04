"use client";

import { useGlobalData } from "@/components/SiteChrome";
import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import { Product } from "@/data/product";
import { isLogin } from "@/utils/login";
import { PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProductsPage() {
    const router = useRouter();

    useEffect(() => {
        isLogin(router, '/products');
    }, [router])
    
    const { products, cart, setCart } = useGlobalData();

    if(products.length === 0) {
        return <div className="p-4 flex flex-col gap-4">
            <h1>Products</h1>
        </div>
    }

    const addToCart = (product: Product) => {
        setCart([...cart, product]);
    }

    return (
        <div className="p-4 flex flex-row flex-wrap gap-4">
            {products.map((product) => (
                <div key={product.id} className="rounded-lg border shadow-sm flex flex-col">
                    <div className="relative">
                        <div className="relative h-full w-full">
                            <Image src={product.thumbnailUrl} alt={product.title} width={100} height={100} className="w-full h-full object-cover rounded-t-lg rounded-b-none" />
                            <h2 className="text-lg font-bold truncate absolute bottom-0 left-0 right-0 bg-black/50 text-white">{product.title}</h2>
                        </div>
                        <Badge color="blue" size="sm" className="absolute top-1 right-1 min-w-5 justify-center px-1.5 py-0 text-lg leading-4 shadow-sm p-2">{product.price}</Badge>
                    </div>
                    <div className="">
                        <Button size="sm" className="w-full rounded-t-none rounded-b-lg" onClick={() => addToCart(product)}>
                            <PlusIcon className="w-4 h-4" />
                            Add to Cart
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}