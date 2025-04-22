//TODO: Apost request to the api of openwebui
export async function POST(request) {
  const { message } = await request.json()
  const reply = `Your message: "${message}"`;
  return Response.json({reply});
}
