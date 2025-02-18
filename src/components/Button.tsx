import { ReactNode } from "react";

interface Button {
  children: ReactNode
}

export default function Button(props: Button) {
  return (
      <button className={"bg-auburn-500 rounded-lg w-fit py-2 px-4 text-center text-white hover:bg-auburn-600"}>
        {props.children}
      </button>
  )
}
