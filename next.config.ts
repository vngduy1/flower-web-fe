import type { NextConfig } from "next";

const backendApiBaseUrl = process.env.BACKEND_API_BASE_URL;

if (!backendApiBaseUrl) {
  throw new Error("BACKEND_API_BASE_URL is required");
}

try {
  new URL(backendApiBaseUrl);
} catch {
  throw new Error("BACKEND_API_BASE_URL must be a valid absolute URL");
}

const normalizedBackendApiBaseUrl = backendApiBaseUrl.replace(/\/$/, "");
const backendOrigin = new URL(normalizedBackendApiBaseUrl).origin;
const deploymentId = process.env.NEXT_DEPLOYMENT_ID?.trim();

if (deploymentId && !/^[A-Za-z0-9._-]{1,128}$/.test(deploymentId)) {
  throw new Error("NEXT_DEPLOYMENT_ID contains unsupported characters");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  ...(deploymentId ? { deploymentId } : {}),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${normalizedBackendApiBaseUrl}/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
