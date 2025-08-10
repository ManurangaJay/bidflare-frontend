"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getApiUrl } from "../../../lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "BUYER",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: "BUYER" | "SELLER") => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // Register user
      const res = await fetch(getApiUrl("/users"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }

      const data = await res.json();
      console.log("Registered:", data);

      // Automatically sign in after successful registration
      const loginRes = await fetch(getApiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!loginRes.ok) {
        const loginErr = await loginRes.json();
        throw new Error(loginErr.message || "Login after registration failed");
      }

      const loginData = await loginRes.json();

      // Store JWT token in localStorage
      localStorage.setItem("token", loginData.token);

      // Redirect to homepage
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Your BidFlare Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:ring-2 focus:ring-orange-500 outline-none"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              What will you be doing on BidFlare?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("BUYER")}
                className={`border rounded-xl p-4 text-center transition ${
                  form.role === "BUYER"
                    ? "bg-orange-100 border-orange-500 text-orange-800"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">I'm here to Bid</div>
                <div className="text-sm">Participate in auctions</div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("SELLER")}
                className={`border rounded-xl p-4 text-center transition ${
                  form.role === "SELLER"
                    ? "bg-orange-100 border-orange-500 text-orange-800"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">I'm here to Sell</div>
                <div className="text-sm">Create and manage auctions</div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-xl hover:bg-orange-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-orange-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
