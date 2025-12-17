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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(`An unknown error occurred while updating ${field}.`);
      }
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred while updating the password.");
      }
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
            <label className="text-sm font-medium text-muted-foreground">
              {label}
            </label>
            {isEditing ? (
              <input
                type={type}
                name={field}
                value={formData[field] || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-2xl px-4 py-3 shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground sm:text-sm backdrop-blur-sm"
                style={{ backgroundColor: "var(--muted)" }}
                disabled={isSubmitting}
              />
            ) : (
              <p className="text-lg text-card-foreground">{user?.[field]}</p>
            )}
          </div>
          {field !== "email" && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => handleSave(field as EditableField)}
                    className="p-2 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30 rounded-full disabled:opacity-50"
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
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-full"
                    disabled={isSubmitting}
                  >
                    <XCircle size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditingField(field as EditableField)}
                  className="p-2 text-muted-foreground hover:bg-muted rounded-full"
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
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="animate-spin text-orange-primary" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-8">
        Error: {error}. Please try refreshing the page.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-muted-foreground p-8">
        Could not find user profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-secondary/20 to-orange-primary/10 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-orange-500 align-middle">
          Manage Your Profile
        </h1>

        {/* Personal Details Section */}
        <div className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-orange-500">My Details</h2>
            <div className="w-full h-px bg-gradient-to-r from-orange-500/30 to-transparent mt-4"></div>
          </div>
          <div className="divide-y divide-border/50">
            {renderField("Full Name", "name")}
            {renderField("Email", "email", "email")}
            <div className="p-4 sm:p-6">
              <label className="text-sm font-medium text-muted-foreground">
                Role
              </label>
              <p className="text-lg text-card-foreground capitalize">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        <AddressSection />

        {/* Password Reset Section */}
        <div className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-orange-500">Security</h2>
            <div className="w-full h-px bg-gradient-to-r from-orange-500/30 to-transparent mt-4"></div>
            <div className="mt-6">
              {!isResettingPassword ? (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-card-foreground">
                      Password
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Set a new password for your account.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsResettingPassword(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-400 dark:to-orange-700 rounded-2xl hover:scale-y-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <KeyRound size={16} /> Change
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordUpdate}>
                  <h3 className="text-lg font-medium text-card-foreground mb-4">
                    Change Your Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-foreground"
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
                          className="block w-full rounded-2xl px-4 py-3 pr-10 shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground sm:text-sm backdrop-blur-sm"
                          style={{ backgroundColor: "var(--muted)" }}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
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
                        className="block text-sm font-medium text-foreground"
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
                          className="block w-full rounded-2xl px-4 py-3 pr-10 shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground sm:text-sm backdrop-blur-sm"
                          style={{ backgroundColor: "var(--muted)" }}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
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
                      className="px-4 py-2 text-sm font-medium text-card-foreground bg-card rounded-2xl shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPasswordSubmitting}
                      className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-400 dark:to-orange-700 rounded-2xl shadow-sm hover:scale-y-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
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
