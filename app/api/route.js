//TODO: Apost request to the api of openwebui
export async function POST() {
  const data = await fetch("https://api.vercel.app/blog");
  const posts = await data.json();
  return Response.json(posts);
}
