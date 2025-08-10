"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Pencil,
  Save,
  XCircle,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { getUserFromToken } from "../../../../../utils/getUserFromToken";
import { authFetch } from "../../../../../lib/authFetch";
import { AddressSection } from "@/components/AddressSection";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  profileImage: string | null;
}

type ProfileFormData = Partial<
  Omit<UserProfile, "id" | "role" | "isVerified">
> & {
  password?: string;
};
type EditableField = keyof Omit<UserProfile, "id" | "role" | "isVerified">;

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({});

  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    const decodedUser = getUserFromToken();
    if (!decodedUser?.userId) {
      setError("Could not identify user. Please log in again.");
      setLoading(false);
      toast.error("Authentication error.");
      return;
    }

    try {
      setLoading(true);
      const res = await authFetch(`/users/${decodedUser.userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data: UserProfile = await res.json();
      setUser(data);
      setFormData({
        name: data.name,
        email: data.email,
        profileImage: data.profileImage,
      });
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (field: EditableField) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const res = await authFetch(`/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ [field]: formData[field] }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to update ${field}`);
      }

      const updatedUser: UserProfile = await res.json();
      setUser(updatedUser);
      setFormData(updatedUser);
      setEditingField(null);
      toast.success(
        `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } updated successfully.`
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setFormData(
      user
        ? {
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
          }
        : {}
    );
  };

  const handlePasswordDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsPasswordSubmitting(true);
    try {
      const res = await authFetch(`/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ password: passwordData.newPassword }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update password.");
      }

      toast.success("Password updated successfully!");
      setIsResettingPassword(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const handlePasswordUpdateCancel = () => {
    setIsResettingPassword(false);
    setPasswordData({ newPassword: "", confirmPassword: "" });
  };

  const renderField = (
    label: string,
    field: keyof UserProfile,
    type: "text" | "email" | "tel" = "text"
  ): React.JSX.Element => {
    const isEditing = editingField === field;
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <div>
            <label className="text-sm font-medium text-gray-500">{label}</label>
            {isEditing ? (
              <input
                type={type}
                name={field}
                value={formData[field] || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                disabled={isSubmitting}
              />
            ) : (
              <p className="text-lg text-gray-900">{user?.[field]}</p>
            )}
          </div>
          {field !== "email" && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => handleSave(field as EditableField)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-full disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Save size={20} />
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    disabled={isSubmitting}
                  >
                    <XCircle size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditingField(field as EditableField)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <Pencil size={20} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-orange-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        Error: {error}. Please try refreshing the page.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-500 p-8">
        Could not find user profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

        {/* Personal Details Section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-orange-900">My Details</h2>
            <hr className="border-orange-200 mt-4" />
          </div>
          <div className="divide-y divide-gray-200">
            {renderField("Full Name", "name")}
            {renderField("Email", "email", "email")}
            <div className="p-4 sm:p-6">
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="text-lg text-gray-900 capitalize">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        <AddressSection />

        {/* Password Reset Section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-orange-900">Security</h2>
            <hr className="border-orange-200 mt-4" />
            <div className="mt-6">
              {!isResettingPassword ? (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Password
                    </h3>
                    <p className="text-sm text-gray-500">
                      Set a new password for your account.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsResettingPassword(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <KeyRound size={16} /> Change
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordUpdate}>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Change Your Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <div className="relative mt-1">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordDataChange}
                          disabled={isPasswordSubmitting}
                          className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                          aria-label={
                            showNewPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showNewPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative mt-1">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordDataChange}
                          disabled={isPasswordSubmitting}
                          className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handlePasswordUpdateCancel}
                      disabled={isPasswordSubmitting}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPasswordSubmitting}
                      className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {isPasswordSubmitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={16} />
                          Saving...
                        </>
                      ) : (
                        "Save Password"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
