"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getApiUrl } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "../../../utils/getUserFromToken";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(getApiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);

      const user = getUserFromToken();
      if (!user) {
        throw new Error("Invalid token");
      }

      // Redirect based on role
      if (user.role.toLowerCase() === "seller") {
        router.push("/seller");
      } else if (user.role.toLowerCase() === "buyer") {
        router.push("/buyer");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-secondary/30 to-orange-primary/20 px-4">
      <div className="max-w-md w-full bg-card/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-card-foreground mb-6 text-center">
          Sign In to{" "}
          <span className="text-orange-500 bg-orange-secondary/30 px-2 py-1 rounded-lg text-4xl font-bold">
            BidFlare
          </span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-input rounded-xl px-4 py-3 pr-10 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none bg-background text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                className="w-full border border-input rounded-xl px-4 py-3 pr-10 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none bg-background text-foreground"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-400 dark:to-orange-700 text-white py-3 rounded-2xl hover:scale-y-105 shadow-lg hover:shadow-xl font-semibold"
            style={{ transition: "all 0.3s ease-in-out" }}
          >
            Sign In
          </button>
        </form>
        <p className="text-sm text-center text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-orange-primary hover:text-orange-accent font-semibold transition-colors duration-300 hover:text-orange-500"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
