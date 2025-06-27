// Utility to detect if running on public Vercel deployment
export function isPublicDeployment() {
  if (typeof window !== "undefined") {
    return window.location.hostname === "cheatsheetnext.vercel.app";
  }
  return false;
}
