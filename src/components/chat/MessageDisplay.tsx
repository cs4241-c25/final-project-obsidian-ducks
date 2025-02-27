import { ChatMessage } from "@/lib/types";
import { twMerge } from "tailwind-merge";

export default function MessageDisplay(props: {username:string,message:ChatMessage}) {
  const sent_by_self = props.message.sender === props.username
  return(
    <div className={twMerge("rounded-sm w-fit px-5 py-2 bg-sky-400",sent_by_self ? "" :"place-self-end")}>
      {props.message.content}
    </div>
  )
}
