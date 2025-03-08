import { ReactNode } from "react";
import { createPortal } from "react-dom";

export default function Modal(props: {children:ReactNode,isOpen: boolean,changeOpenSignal:(open:boolean) =>void }) {


  if(props.isOpen === false) {
    return
  }
  function modal():ReactNode {
    return(
      <div className="absolute top-0 z-50 h-svh w-full flex items-center justify-center">
        <div className="bg-white border-2 drop-shadow-2xl rounded-xl p-5">
          <div onClick={() => props.changeOpenSignal(false)}  className="">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          </div>
          {props.children}
        </div>
      </div>
    )
  }

  return (
    <>
      {createPortal(modal(), document.body)}
    </>
  )
}
