"use client"
import { redirect } from 'next/navigation';
import { useSession } from "next-auth/react";
import ChatRoom from '@/components/chat/ChatRoom';

export default function Page() {
  const { data: session } = useSession()
  if (session === null) {
    redirect('/login');
  }
  return (
    <ChatRoom chat_id={""} />
  )
}
