import React, { useState } from "react";
import { Save, AlertCircle } from "lucide-react";
import { Product, CreateProductRequest } from "@/types/product";
import { validateProduct } from "@/utils/validation";

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: CreateProductRequest) => Promise<void>;
  onCancel: () => void;
}

interface ProductFormData {
  code: string;
  name: string;
  description: string;
  price: string;
  active: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    code: product?.code || "",
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    active: product?.active !== false,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      const productData: CreateProductRequest = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        active: formData.active,
      };

      const validation = validateProduct(productData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      await onSave(productData);
    } catch (error) {
      if (error instanceof Error && error.message.includes("details")) {
        try {
          const detailsPart = error.message.split('details": ')[1];
          if (detailsPart) {
            const errorData = JSON.parse(detailsPart.slice(0, -1));
            setErrors(Array.isArray(errorData) ? errorData : [errorData]);
          } else {
            setErrors([error.message]);
          }
        } catch {
          setErrors([error.message]);
        }
      } else {
        setErrors([
          error instanceof Error ? error.message : "An error occurred",
        ]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange =
    (field: keyof ProductFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h3>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="font-semibold">Validation Errors:</span>
            </div>
            <ul className="list-disc list-inside text-sm">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
              placeholder="Enter product name"
              title="Product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={handleInputChange("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
              disabled={isSubmitting}
              placeholder="Enter product description"
              title="Product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleInputChange("price")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
              placeholder="Enter price"
              title="Product price"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={handleInputChange("active")}
              className="mr-2"
              disabled={isSubmitting}
            />
            <label
              htmlFor="active"
              className="text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
