import { getServerEnvironment } from "@/config/server-env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const environment = getServerEnvironment();
    const response = await fetch(`${environment.BACKEND_API_BASE_URL}/health/ready`, {
      cache: "no-store",
      signal: AbortSignal.timeout(environment.HEALTHCHECK_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error("Backend is not ready");
    }

    return Response.json(
      { status: "ok" },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return Response.json(
      { status: "unavailable" },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
