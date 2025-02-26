import Message from "@/models/Messages";

export async function POST(req: Request) {
  try {
  const data:{chat_id:string} = await req.json();
  const messages = await Message.find({ chat_id: data.chat_id })
  return new Response(
    JSON.stringify(messages),
    {
        status: 200,
        statusText: "OK",
        headers: {"Content-type": "application/json"}
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
