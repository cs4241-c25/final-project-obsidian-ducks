import { ReactNode } from "react";

interface Button {
  onClick: () => void,
  children: ReactNode
}

export default function Button(props: Button) {
  return (
      <button onClick={props.onClick}>
        {props.children}
      </button>
  )
}
