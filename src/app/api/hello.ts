
export async function GET(request:Request) {
  console.log(request)
  return Response.json({ message:"example api route" })
}
