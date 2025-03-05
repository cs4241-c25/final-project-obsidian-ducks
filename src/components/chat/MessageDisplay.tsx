import { ChatMessage } from "@/lib/types";
import { twMerge } from "tailwind-merge";

export default function MessageDisplay(props: {username:string,message:ChatMessage}) {
  const sent_by_self = props.message.sender === props.username
  return(
    <div className={twMerge("text-wrap text-xl",sent_by_self ? "" :"place-self-end")}>
      <div className="text-sm">
        {props.message.sender}
      </div>
      <div className="rounded-sm overflow-hidden text-center max-w-5xl px-5 py-2 bg-alice-blue-800 ">
        <h1 className="text-ellipsis">{props.message.content}</h1>
      </div>
    </div>
  )
}
