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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-secondary/20 to-orange-primary/10 px-4">
      <div className="max-w-md w-full bg-card/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-card-foreground mb-6 text-center">
          Create Your{" "}
          <span className="text-orange-500 bg-orange-secondary/30 px-2 py-1 rounded-lg text-4xl font-bold">
            BidFlare
          </span>{" "}
          Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full border bg-background/50 backdrop-blur-sm rounded-2xl px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground transition-all duration-300 shadow-sm"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full border bg-background/50 backdrop-blur-sm rounded-2xl px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground transition-all duration-300 shadow-sm"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full border border-input rounded-xl px-4 py-2 pr-10 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none bg-background text-foreground"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              What will you be doing on BidFlare?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("BUYER")}
                className={`rounded-2xl p-4 text-center shadow-sm border border-input ${
                  form.role === "BUYER"
                    ? "bg-orange-600 text-primary-foreground shadow-lg scale-105 text-white"
                    : "bg-card/50 backdrop-blur-sm text-card-foreground hover:bg-orange-secondary/20 hover:shadow-md"
                }`}
                style={{ transition: "all 0.5s ease-in-out" }}
              >
                <div className="font-medium">I&apos;m here to Bid</div>
                <div className="text-sm">Participate in auctions</div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("SELLER")}
                className={`border rounded-2xl p-4 text-center shadow-sm ${
                  form.role === "SELLER"
                    ? "bg-orange-600 text-primary-foreground shadow-lg scale-105 text-white"
                    : "bg-card/50 backdrop-blur-sm text-card-foreground hover:bg-orange-secondary/20 hover:shadow-md"
                }`}
                style={{ transition: "all 0.5s ease-in-out" }}
              >
                <div className="font-medium">I&apos;m here to Sell</div>
                <div className="text-sm">Create and manage auctions</div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-400 dark:to-orange-700 text-white py-3 rounded-2xl   hover:scale-y-105 shadow-lg hover:shadow-xl font-semibold"
            style={{ transition: "all 0.3s ease-in-out" }}
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-orange-primary hover:text-orange-accent font-semibold transition-colors duration-300 hover:text-orange-500"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
