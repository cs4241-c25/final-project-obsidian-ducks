import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Button {
    children: ReactNode;
    className?: string;
    type: "button" | "submit" | "reset" | undefined
}

export default function Button(props: Button) {
  return (
      <button className={ twMerge("bg-auburn-500 hover:bg-auburn-600 rounded-lg w-fit py-2 px-4 text-center text-white ", props.className) }>
          { props.children }
      </button>
  )
}
