import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProductSchema } from "../validations/add-new-product-validation";
import MessageBox from "../messagealert/message";
import { createProduct } from "../../services/product-service";
import { ProductResponse } from "../../api/products";
import { ProductModel } from "../../models/produt";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProductModal = ({ isOpen, onClose }: ProductModalProps) => {
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" }>({ text: "", type: "success" });

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(ProductSchema),
        mode: "onChange", // Garante validação em tempo real
    });

    if (!isOpen) return null;

    interface ProductData {
        name: string;
        description?: string;
        unit: string;
        price: number;
    }

    const handleCreateProduct = async (data: ProductData): Promise<void> => {
        try {
            const productData: ProductModel = {
                ...data,
                taxes: []
            };
            const response: ProductResponse = await createProduct(productData);

            if (response) {
                setMessage({ text: "Product created successfully!", type: "success" });
                onClose();
            } else {
                setMessage({ text: "Error creating product.", type: "error" });
            }
        } catch {
            setMessage({ text: "Error creating product.", type: "error" });
        }
    };

    return (
        <div className={`fixed inset-0 flex z-50 items-center justify-center transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
            <div className="bg-white w-[700px] p-6 rounded-lg shadow-lg relative">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl cursor-pointer" onClick={onClose}>×</button>
                <MessageBox message={message.text} type={message.type} />
                <h2 className="text-xl font-bold mb-2">Create Product/Service Profile!</h2>
                <hr className="mb-7 border border-gray-200" />
                <form>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <label className="text-xs font-semibold uppercase text-gray-700">Product Name</label>
                            <input {...register("name")} className="w-full h-[40px] px-4 rounded-lg border border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none transition-all duration-300" placeholder="Product Name" />
                            {errors.name && <p className="text-[#f4777f] mt-1.5">{errors.name?.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase text-gray-700">Description</label>
                            <textarea {...register("description")} className="w-full h-[60px] p-2 rounded-lg border border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none transition-all duration-300" placeholder="Description"></textarea>
                            {errors.description && <p className="text-[#f4777f] mt-1.5">{errors.description?.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 uppercase">Unit</label>
                            <select {...register("unit")} className="w-full h-[40px] p-2 rounded-lg border border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none transition-all duration-300">
                                <option value="">Select a unit</option>
                                <option value="Kg">Kg</option>
                                <option value="L">L</option>
                                <option value="Unit">Unit</option>
                                <option value="Box">Box</option>
                            </select>
                            {errors.unit && <p className="text-[#f4777f] mt-1.5">{errors.unit?.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase text-gray-700">Price</label>
                            <input {...register("price")} className="w-full h-[40px] px-4 rounded-lg border border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none transition-all duration-300" placeholder="Price" type="number" min="0" step="0.01" />
                            {errors.price && <p className="text-[#f4777f] mt-1.5">{errors.price?.message}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end gap-5 items-center mt-4 border-t border-gray-200 pt-4">
                        <button className="text-gray-500 hover:text-gray-700 text-sm" type="button" onClick={onClose}>Cancel</button>
                        <button
                            className={`bg-[#12153A] text-[14px] text-white px-4 py-2 rounded-3xl transition-all duration-300
                            ${isValid ? "hover:bg-[#12153ae8] cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
                            type="button"
                            onClick={handleSubmit(handleCreateProduct)}
                            disabled={!isValid}
                        >
                            Create Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
