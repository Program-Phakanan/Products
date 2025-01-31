import React, { useEffect, useState } from "react";
import NewProduct from "../Components/NewProduct";
import ProductItem from "../Components/ProductItem";
import { toast } from "react-toastify";
import { MdSearch } from "react-icons/md";

const ProductPage = () => {
 const [products, setProducts] = useState([]);
 const [searchTerm, setSearchTerm] = useState("");

 // สร้าง Request สำหรับ GET
 const createGetRequest = () => {
   return new Request("/api/products", {
     method: "GET",
     headers: {
       "Accept": "application/json"
     }
   });
 };

 // สร้าง Request สำหรับ POST
 const createPostRequest = (product) => {
   return new Request("/api/products", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "Accept": "application/json"
     },
     body: JSON.stringify(product)
   });
 };

 // สร้าง Request สำหรับ PUT
 const createPutRequest = (product, id) => {
   return new Request(`/api/products/${id}`, {
     method: "PUT",
     headers: {
       "Content-Type": "application/json",
       "Accept": "application/json"
     },
     body: JSON.stringify({ ...product, id })
   });
 };

 // สร้าง Request สำหรับ DELETE
 const createDeleteRequest = (id) => {
   return new Request(`/api/products/${id}`, {
     method: "DELETE",
     headers: {
       "Accept": "application/json"
     }
   });
 };

 // ฟังก์ชันสำหรับจัดการ Response
 const handleResponse = async (response) => {
   if (!response.ok) {
     const errorData = await response.text();
     throw new Error(errorData || `HTTP error! status: ${response.status}`);
   }
   const contentType = response.headers.get("content-type");
   if (contentType && contentType.includes("application/json")) {
     return await response.json();
   }
   return null;
 };

 useEffect(() => {
   const fetchProducts = async () => {
     try {
       const request = createGetRequest();
       const response = await fetch(request);
       const data = await handleResponse(response);
       setProducts(data || []);
     } catch (error) {
       console.error('Fetch error:', error);
       toast.error("Failed to fetch products!", { autoClose: 2000 });
     }
   };
   fetchProducts();
 }, []);

 const addProduct = async (product) => {
   try {
     const request = createPostRequest(product);
     const response = await fetch(request);
     const newProduct = await handleResponse(response);
     if (newProduct) {
       setProducts((prevProducts) => [...prevProducts, newProduct]);
       toast.success("Product added successfully!", { autoClose: 2000 });
     }
   } catch (error) {
     console.error('Add error:', error);
     toast.error("Failed to add product!", { autoClose: 2000 });
   }
 };

 const updateProduct = async (product, id) => {
   try {
     const request = createPutRequest(product, id);
     const response = await fetch(request);
     const updatedProduct = await handleResponse(response);
     if (updatedProduct) {
       setProducts((prevProducts) =>
         prevProducts.map((p) => (p.id === id ? updatedProduct : p))
       );
       toast.info("Product updated successfully!", { autoClose: 2000 });
     }
   } catch (error) {
     console.error('Update error:', error);
     toast.error("Failed to update product!", { autoClose: 2000 });
   }
 };

 const deleteProduct = async (id) => {
   try {
     const request = createDeleteRequest(id);
     const response = await fetch(request);
     await handleResponse(response);
     setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
     toast.success("Product deleted successfully!", { autoClose: 2000 });
   } catch (error) {
     console.error('Delete error:', error);
     toast.error("Failed to delete product!", { autoClose: 2000 });
   }
 };

 const handleSearchChange = (e) => {
   setSearchTerm(e.target.value);
 };

 const filteredProducts = products.filter((product) =>
   product.name.toLowerCase().includes(searchTerm.toLowerCase())
 );

 return (
   <div className="container mx-auto p-4">
     <div className="flex items-center gap-2 mb-4">
       <input
         type="text"
         placeholder="Search products..."
         value={searchTerm}
         onChange={handleSearchChange}
         className="w-full p-2 border rounded"
       />
       <button className="bg-blue-500 text-white p-2 rounded flex items-center">
         <MdSearch className="mr-2" />
         Search
       </button>
     </div>

     <NewProduct addProduct={addProduct} />

     {filteredProducts.length > 0 ? (
       <table className="min-w-full mt-6 border-collapse">
         <thead>
           <tr className="bg-gray-200">
             <th className="px-4 py-2 border">#</th>
             <th className="px-4 py-2 border">Name</th>
             <th className="px-4 py-2 border">Description</th>
             <th className="px-4 py-2 border">Price</th>
             <th className="px-4 py-2 border">Quantity</th>
             <th className="px-4 py-2 border">Actions</th>
           </tr>
         </thead>
         <tbody>
           {filteredProducts.map((product, index) => (
             <ProductItem
               key={product.id || index}
               id={index + 1}
               product={product}
               updateProduct={(updatedProduct) => updateProduct(updatedProduct, product.id)}
               deleteProduct={() => deleteProduct(product.id)}
             />
           ))}
         </tbody>
       </table>
     ) : (
       <p className="mt-6 text-center text-gray-500">
         No products found matching your search.
       </p>
     )}
   </div>
 );
};

export default ProductPage;