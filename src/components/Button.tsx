import { ReactNode } from "react";

interface Button {
    children: ReactNode
    type: "button" | "submit" | "reset" | undefined
}

export default function Button({ className = "", children, ...props }: Button) {
  return (
      <button className={`bg-auburn-500 rounded-lg w-fit py-2 px-4 text-center text-white hover:bg-auburn-600 ${className}`} {...props}>
          {children}
      </button>
  )
}
