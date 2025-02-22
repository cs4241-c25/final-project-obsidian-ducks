import { ChatMessage } from "@/lib/types";

export default function MessageDisplay(props: {message:ChatMessage}) {
  return(
    <div className="rounded-sm w-fit px-5 py-2 bg-sky-400">
      {props.message.content}
    </div>
  )
}
