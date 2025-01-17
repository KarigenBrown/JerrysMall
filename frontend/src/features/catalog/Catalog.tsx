import {Product} from "../../app/models/Product.ts";
import ProductList from "./ProductList.tsx";
import {useEffect, useState} from "react";

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("http://localhost:5000/Backend/Products")
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [])

    return (
        <>
            <ProductList products={products}/>
        </>
    )
}