"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  MapPin,
  Plus,
  Home,
  Trash2,
  Pencil,
  Save,
  X,
  Loader2,
  Star,
} from "lucide-react";
import { authFetch } from "../../lib/authFetch";

// Interface for a single address
interface Address {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Type for the form data, all fields are optional for partial updates
type AddressFormData = Partial<Omit<Address, "id">>;

export function AddressSection() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for the form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    label: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  // Fetch all addresses for the current user
  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authFetch("/addresses");
      if (!res.ok) throw new Error("Failed to fetch addresses.");
      const data: Address[] = await res.json();
      setAddresses(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      toast.error("Could not load your addresses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Handle opening the form for adding a new address
  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      label: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
      isDefault: addresses.length === 0,
    });
    setIsFormOpen(true);
  };

  // Handle opening the form for editing an existing address
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setIsFormOpen(true);
  };

  // Generic input change handler for the form
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission (for both creating and updating)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = editingAddress
      ? `/addresses/${editingAddress.id}`
      : "/addresses";
    const method = editingAddress ? "PUT" : "POST";

    try {
      const res = await authFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save address.");
      }

      toast.success(
        `Address ${editingAddress ? "updated" : "added"} successfully!`
      );
      setIsFormOpen(false);
      fetchAddresses(); // Refresh the list
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting an address
  const handleDelete = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      const res = await authFetch(`/addresses/${addressId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete address.");
      toast.success("Address deleted successfully.");
      fetchAddresses(); // Refresh the list
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  // Handle setting an address as the default
  const handleSetDefault = async (addressId: string) => {
    try {
      const res = await authFetch(`/addresses/${addressId}/set-default`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to set default address.");
      toast.success("Default address updated.");
      fetchAddresses(); // Refresh the list
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm p-6 border border-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-orange-primary">My Addresses</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-orange-primary rounded-lg hover:bg-orange-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-primary"
        >
          <Plus size={16} /> Add New
        </button>
      </div>
      <hr className="border-orange-primary/30" />

      <div className="bg-card rounded-2xl overflow-hidden p-4 mt-4 border border-border">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="animate-spin text-orange-primary" size={32} />
          </div>
        ) : error ? (
          <p className="text-destructive text-center">{error}</p>
        ) : addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 rounded-lg border ${
                  address.isDefault
                    ? "border-orange-primary bg-orange-secondary/50 dark:bg-orange-primary/20"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Home size={20} className="text-orange-primary" />
                    <h3 className="font-bold text-lg text-card-foreground">
                      {address.label}
                    </h3>
                  </div>
                  {address.isDefault && (
                    <div className="flex items-center gap-1 text-sm bg-orange-primary text-primary-foreground px-2 py-1 rounded-full">
                      <Star size={14} />
                      <span>Default</span>
                    </div>
                  )}
                </div>
                <div className="text-muted-foreground mt-2 space-y-1">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.stateProvince} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-sm font-medium text-orange-primary hover:text-orange-accent"
                    >
                      Set as Default
                    </button>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-muted-foreground hover:bg-muted rounded-full"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="mx-auto text-muted-foreground" size={40} />
            <p className="mt-2 text-muted-foreground">
              You haven&apos;t added any addresses yet.
            </p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/60 flex justify-center items-center p-4 z-50 shadow-2xl">
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-orange-primary">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields */}
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Label (e.g. Home, Work)
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-sm border-input shadow-sm focus:border-orange-primary focus:ring-orange-primary bg-background text-foreground p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-sm border-input shadow-sm focus:border-orange-primary focus:ring-orange-primary bg-background text-foreground p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2 || ""}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-sm border-input shadow-sm focus:border-orange-primary focus:ring-orange-primary bg-background text-foreground p-2"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-sm border-input shadow-sm focus:border-orange-primary focus:ring-orange-primary bg-background text-foreground p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="stateProvince"
                    value={formData.stateProvince}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-sm border-input shadow-sm focus:border-orange-primary focus:ring-orange-primary bg-background text-foreground p-2"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-sm border-input shadow-sm focus:border-orange-primary focus:ring-orange-primary bg-background text-foreground p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-sm border-input shadow-sm focus:border-orange-primary focus:ring-orange-primary bg-background text-foreground p-2"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="isDefault"
                  name="isDefault"
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={handleFormChange}
                  className="h-4 w-4 rounded border-input text-orange-primary focus:ring-orange-primary"
                />
                <label
                  htmlFor="isDefault"
                  className="ml-2 block text-sm text-foreground"
                >
                  Set as default address
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md shadow-sm hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white-500 bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-accent disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : (
                    <Save size={16} className="mr-2" />
                  )}
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
