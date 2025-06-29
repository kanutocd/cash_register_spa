import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";
import type { Product } from "@/types/product";
import type { Promo, CreatePromoRequest, PromoFormData } from "@/types/product";
import { PROMO_TYPE_LABELS } from "@/utils/constants";

interface PromoFormProps {
  product: Product;
  promo?: Promo | null;
  onSave: (promo: CreatePromoRequest) => Promise<void>;
  onCancel: () => void;
}

const PromoForm = ({ product, promo, onSave, onCancel }: PromoFormProps) => {
  const [formData, setFormData] = useState<PromoFormData>({
    name: promo?.name || "",
    promo_type: promo?.promo_type || "buy_x_get_y_free",
    trigger_qty: promo?.trigger_qty || 1,
    free_qty: promo?.free_qty || 1,
    discount_percentage: promo?.discount_percentage || 10,
    discount_amount: promo?.discount_amount || 1,
    active: promo?.active !== false,
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
      const promoData: CreatePromoRequest = {
        name: formData.name,
        promo_type: formData.promo_type,
        trigger_qty: formData.trigger_qty,
        active: formData.active,
      };

      if (formData.promo_type === "buy_x_get_y_free") {
        promoData.free_qty = formData.free_qty;
      } else if (formData.promo_type === "percentage_discount") {
        promoData.discount_percentage = formData.discount_percentage;
      } else if (formData.promo_type === "fixed_discount") {
        promoData.discount_amount = formData.discount_amount;
      }

      // Basic validation
      const validationErrors: string[] = [];
      if (!promoData.name.trim())
        validationErrors.push("Promo name is required");
      if (promoData.trigger_qty <= 0)
        validationErrors.push("Trigger quantity must be greater than 0");

      if (
        formData.promo_type === "buy_x_get_y_free" &&
        formData.free_qty <= 0
      ) {
        validationErrors.push("Free quantity must be greater than 0");
      }
      if (
        formData.promo_type === "percentage_discount" &&
        (formData.discount_percentage <= 0 ||
          formData.discount_percentage > 100)
      ) {
        validationErrors.push("Discount percentage must be between 1 and 100");
      }
      if (
        formData.promo_type === "fixed_discount" &&
        formData.discount_amount <= 0
      ) {
        validationErrors.push("Discount amount must be greater than 0");
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      await onSave(promoData);
    } catch (error) {
      if (error instanceof Error && error.message.includes("details")) {
        try {
          const errorData = JSON.parse(
            error.message.split('details": ')[1]?.slice(0, -1) || "[]"
          );
          setErrors(Array.isArray(errorData) ? errorData : [errorData]);
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
    (field: keyof PromoFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.type === "number"
          ? parseFloat(e.target.value) || 0
          : e.target.value;

      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-in">
        <h3 className="text-xl font-bold mb-2 text-gray-900">
          {promo ? "Edit Promo" : "Add Promo"}
        </h3>
        <p className="text-sm text-gray-600 mb-6">Product: {product.name}</p>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="font-semibold">Validation Errors:</span>
            </div>
            <ul className="list-disc list-inside text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promo Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
              required
              disabled={isSubmitting}
              placeholder="Enter promo name"
            />
          </div>

          <div>
            <label
              htmlFor="promo-type-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Promo Type
            </label>
            <select
              id="promo-type-select"
              value={formData.promo_type}
              onChange={handleInputChange("promo_type")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
              disabled={isSubmitting}
            >
              {Object.entries(PROMO_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trigger Quantity
            </label>
            <input
              type="number"
              min="1"
              value={formData.trigger_qty}
              onChange={handleInputChange("trigger_qty")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
              required
              disabled={isSubmitting}
              title="Enter the trigger quantity for the promo"
              placeholder="Trigger quantity"
            />
          </div>

          {formData.promo_type === "buy_x_get_y_free" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Quantity
              </label>
              <input
                type="number"
                min="1"
                value={formData.free_qty}
                onChange={handleInputChange("free_qty")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                required
                disabled={isSubmitting}
                title="Enter the free quantity for the promo"
                placeholder="Free quantity"
              />
            </div>
          )}

          {formData.promo_type === "percentage_discount" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.discount_percentage}
                onChange={handleInputChange("discount_percentage")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                required
                disabled={isSubmitting}
                title="Enter the discount percentage"
                placeholder="Discount percentage"
              />
            </div>
          )}

          {formData.promo_type === "fixed_discount" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.discount_amount}
                onChange={handleInputChange("discount_amount")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                required
                disabled={isSubmitting}
                title="Enter the discount amount"
                placeholder="Discount amount"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="promo-active"
              checked={formData.active}
              onChange={handleInputChange("active")}
              className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 focus:ring-2"
              disabled={isSubmitting}
              title="Toggle promo active status"
            />
            <label
              htmlFor="promo-active"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 flex items-center transition-colors"
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

export default PromoForm;
