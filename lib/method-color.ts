export const getMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    GET: "bg-blue-500/10 text-blue-800 border-blue-500/20",
    POST: "bg-green-500/10 text-green-800 border-green-500/20",
    PUT: "bg-yellow-500/10 text-yellow-800 border-yellow-500/20",
    DELETE: "bg-red-500/10 text-red-800 border-red-500/20",
    PATCH: "bg-purple-500/10 text-purple-800 border-purple-500/20",
  };
  return colors[method] || "bg-gray-500/10 text-gray-800";
};
