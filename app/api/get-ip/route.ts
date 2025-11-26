export async function GET(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(";")[0] : request.headers.get("x-real-ip") || "unknown"

  return Response.json({ ip })
}
