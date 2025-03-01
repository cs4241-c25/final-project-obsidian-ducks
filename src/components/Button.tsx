import { ReactNode, MouseEvent } from "react";
import { twMerge } from "tailwind-merge";

interface Button {
    children: ReactNode;
    className?: string;
    type: "button" | "submit" | "reset" | undefined
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
}

export default function Button(props: Button) {
  return (
      <button type={props.type}
              className={twMerge(
                  "bg-crimson-500 hover:bg-crimson-700 rounded-lg w-fit py-2 px-4 text-center text-white cursor-pointer",
                  props.className
              )}
              onClick={props.onClick}
      >
          {props.children}
      </button>
  )
}
