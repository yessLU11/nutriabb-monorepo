export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return Response.json({
    message: "Frontend está funcionando correctamente",
    backend_url: apiUrl
  });
}
