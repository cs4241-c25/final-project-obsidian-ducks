import { createChatRoom,findChatRooms }  from "@/lib/createChatRoom";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
  console.log("test")
  const searchParams = req.nextUrl.searchParams
  const username:string | null = searchParams.get('username')
  console.log(username)
  if(username === null) {
    return new Response(
        JSON.stringify({message: "please enter a username"}),
        {
            status: 400,
            statusText: "User Error"
        }
    )
  }
  const chat_rooms = await findChatRooms(username);
  try {
    return new Response(
      JSON.stringify(chat_rooms),
      {
        status: 200,
        statusText: "OK",
        headers: { "Content-type": "application/json" }
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

export async function POST(req: Request) {
  try {
    const { chatters}:{chatters:string[]} = await req.json();

    const { chat_id } = await createChatRoom(chatters)

    return new Response(
      JSON.stringify({
        chat_id:chat_id,
        chatters:chatters
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
