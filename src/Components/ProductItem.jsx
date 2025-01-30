import React, { useState, useRef } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

const ProductItem = ({ product, id, updateProduct, deleteProduct }) => {
  const [editing, setEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const dialog = useRef(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = (e) => {
    e.preventDefault();
    updateProduct(editedProduct, id);
    if (dialog.current) {
      dialog.current.close();
    }
    setEditing(false);
  };

  const openModal = () => {
    if (dialog.current) {
      setEditing(true);
      dialog.current.showModal();
    }
  };

  const closeModal = () => {
    if (dialog.current) {
      dialog.current.close();
      setEditing(false);
    }
  };

  return (
    <React.Fragment>
      <tr className="bg-white border-b">
        <td className="px-4 py-2">{id + 1}</td>
        <td className="px-4 py-2">{product.name}</td>
        <td className="px-4 py-2">{product.description}</td>
        <td className="px-4 py-2">{product.price} THB</td>
        <td className="px-4 py-2">{product.quantity}</td>
        <td className="px-4 py-2">
          <button onClick={openModal} className="text-teal-500">
            <MdEdit />
          </button>
          <button
            onClick={() => deleteProduct(id)}
            className="text-red-500 ml-2"
          >
            <MdDelete />
          </button>
        </td>
      </tr>
      
      <dialog
        ref={dialog}
        className="rounded-md w-[480px] relative"
        onClick={(e) => e.target === dialog.current && closeModal()}
      >
        <form className="p-6" onSubmit={submitEdit}>
          <h3 className="font-semibold text-xl">Edit Product</h3>
          <div className="mt-4">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={editedProduct.name}
              onChange={handleEditChange}
              className="border p-2 w-full mt-2"
            />
          </div>
          <div className="mt-4">
            <label>Product Description</label>
            <textarea
              name="description"
              value={editedProduct.description}
              onChange={handleEditChange}
              className="border p-2 w-full mt-2"
            />
          </div>
          <div className="mt-4">
            <label>Product Price</label>
            <input
              type="number"
              name="price"
              value={editedProduct.price}
              onChange={handleEditChange}
              className="border p-2 w-full mt-2"
            />
          </div>
          <div className="mt-4">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={editedProduct.quantity}
              onChange={handleEditChange}
              className="border p-2 w-full mt-2"
            />
          </div>
          <div className="mt-6 text-right space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded border border-gray-200 px-3 py-2 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="rounded bg-teal-500 px-3 py-2 text-white hover:bg-teal-600"
            >
              Confirm
            </button>
          </div>
        </form>
      </dialog>
    </React.Fragment>
  );
};

export default ProductItem;