import ChatRoom from "@/components/chat/ChatRoom";

export default async function Page({params}: { params: Promise<{ id: string }>}) {
  console.log((await params).id)
  return (
    <ChatRoom chat_id={(await params).id} />
  )
}
