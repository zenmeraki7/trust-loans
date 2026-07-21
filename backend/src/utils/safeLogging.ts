export const safeErrorType = (error: unknown) => {
  if (!(error instanceof Error)) return typeof error;
  const safeName = error.name.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);
  return safeName || "Error";
};
