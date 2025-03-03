import { ChatMessage } from "@/lib/types";
import { twMerge } from "tailwind-merge";

export default function MessageDisplay(props: {username:string,message:ChatMessage}) {
  const sent_by_self = props.message.sender === props.username
  return(
    <div className={twMerge("w-fit text-xl",sent_by_self ? "" :"place-self-end")}>
      <div className="text-sm">
        {props.message.sender}
      </div>
      <div className="rounded-sm w-full text-center px-5 py-2 bg-alice-blue-800 ">
        {props.message.content}
      </div>
    </div>
  )
}
