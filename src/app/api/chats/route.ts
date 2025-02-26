import Message from "@/models/Messages";

export async function POST(req: Request) {
  try {
    const { chat_id}:{chat_id:string} = await req.json();
    console.log(chat_id)

    const messages = await Message.find({ chat_id: chat_id }).exec()
    console.log(messages)
    return new Response(
      JSON.stringify(messages),
      {
          status: 200,
          statusText: "OK",
          headers: {"Content-type": "application/json"}
      }
    )
  } catch(e) {
    console.log(e)
    return new Response(
        JSON.stringify({message: "Failed to fetch messages"}),
        {
            status: 500,
            statusText: "Internal Server Error"
        }
    )
  }
}
