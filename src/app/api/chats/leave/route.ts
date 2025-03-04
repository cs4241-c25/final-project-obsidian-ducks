import { createChatRoom,findChatRooms,leaveChatRoom }  from "@/lib/createChatRoom";
import { NextRequest } from "next/server";


export async function POST(req: Request) {
  try {
    const { chat_id,username}:{chat_id:string,username:string} = await req.json();

    const newChatRoom = await leaveChatRoom(username,chat_id)

    return new Response(
      JSON.stringify({
        chat_id:newChatRoom.chat_id,
      }),
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
