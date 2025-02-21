import { Message } from "@/";

export default function MessageDisplay(props: {message:Message}) {
  return(
    <div className="rounded-sm w-fit px-5 py-2 bg-sky-400">
      {props.message.message}
    </div>
  )
}
