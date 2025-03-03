"use client"
import { ChatRoom } from "@/components/chat/ChatRoom";
import { redirect } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession()
  if (!session) {
    redirect('/login');
  }
  return (
    <ChatRoom chat_id={""} />
  )
}
