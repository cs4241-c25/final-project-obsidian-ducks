import ChatRoom from "@/models/ChatRoom";

export async function POST(req: Request) {
  try {
    const data: { username: string } = await req.json();
    const chatRooms = await ChatRoom.find({ username: data.username })
    return new Response(
      JSON.stringify(chatRooms),
      {
        status: 200,
        statusText: "OK",
        headers: { "Content-type": "application/json" }
      }
    )
  } catch(e) {
    return new Response(
        "Failed to fetch items",
        {
            status: 500,
            statusText: "Internal Server Error"
        }
    )
  }
}
