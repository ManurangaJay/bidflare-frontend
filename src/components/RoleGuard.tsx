"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DecodedUser, getUserFromToken } from "../../utils/getUserFromToken";

interface RoleGuardProps {
  allowedRoles: string[]; // ["BUYER"], ["SELLER"], ["ADMIN"]
  children: ReactNode;
  fallback?: ReactNode; // Optional fallback UI while loading or unauthorized
  redirectPath?: string;
}

const RoleGuard = ({
  allowedRoles,
  children,
  fallback = <p>Loading...</p>,
  redirectPath = "/unauthorized",
}: RoleGuardProps) => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user: DecodedUser | null = getUserFromToken();

    if (!user) {
      // Not logged in -> redirect to signin
      router.push(redirectPath);
      setAuthorized(false);
      return;
    }

    if (!allowedRoles.includes(user.role.toUpperCase())) {
      // Role not allowed -> redirect to unauthorized or signin
      router.push(redirectPath);
      setAuthorized(false);
      return;
    }

    setAuthorized(true);
  }, [allowedRoles, redirectPath, router]);

  if (authorized === null) return fallback; // loading state
  if (authorized === false) return null;

  return <>{children}</>;
};

export default RoleGuard;
