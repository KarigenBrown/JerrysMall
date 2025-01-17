import {Product} from "../../app/models/Product.ts";
import ProductList from "./ProductList.tsx";
import {useEffect, useState} from "react";
import agent from "../../app/api/agent.ts";

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        agent.Catalog.list()
            .then(products=>setProducts(products))
    }, [])

    return (
        <>
            <ProductList products={products}/>
        </>
    )
}