export interface DecodedUser {
  email: string;
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
  name?: string;
}

export const getUserFromToken = (): DecodedUser | null => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    const parsed = JSON.parse(decodedPayload);

    return {
      email: parsed.sub,
      userId: parsed.userId,
      role: parsed.role,
      iat: parsed.iat,
      exp: parsed.exp,
      name: parsed.name,
    };
  } catch (err) {
    console.error("Failed to decode JWT", err);
    return null;
  }
};
