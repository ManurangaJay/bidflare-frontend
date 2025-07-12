export const getApiUrl = (path: string): string => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
};
