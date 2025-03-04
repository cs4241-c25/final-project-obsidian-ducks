import {ChatMessage} from "@/lib/types";
import Message from "@/models/Messages";
import {NextRequest} from "next/server";
import connectToDatabase from "@/lib/db";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const chat_id: string | null = searchParams.get('chatid')
    if (chat_id === null) {
        return new Response(
            JSON.stringify({message: "please enter a chat_id"}),
            {
                status: 400,
                statusText: "Ueser Error"
            }
        )
    }
    try {
        await connectToDatabase();
        const messages = await Message.find({chat_id: chat_id}).exec()
        console.log(chat_id)

        console.log("getting")
        console.log(messages)
        return new Response(
            JSON.stringify(messages),
            {
                status: 200,
                statusText: "OK",
                headers: {"Content-type": "application/json"}
            }
        )
    } catch (e) {
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
        const msg: ChatMessage = await req.json();
        console.log(msg)
        const chat_msg_db = new Message()
        chat_msg_db.event = "MESSAGE"
        chat_msg_db.sender = msg.sender
        chat_msg_db.content = msg.content
        chat_msg_db.message_id = msg.msg_id
        chat_msg_db.chat_id = msg.chat_id
        chat_msg_db.sender = msg.sender
        chat_msg_db.chatters = msg.chatters
        console.log(await chat_msg_db.save())
        return new Response(
            JSON.stringify({
                message: "sucesss"
            }),
            {
                status: 200,
                statusText: "OK",
                headers: {"Content-type": "application/json"}
            }
        )
    } catch (e) {
        console.log(e)
        return new Response(
            JSON.stringify({message: "Failed to save message"}),
            {
                status: 500,
                statusText: "Internal Server Error"
            }
        )
    }
}
