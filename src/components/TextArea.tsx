import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TextArea {
    className?: string;
    children: ReactNode;
    name: string;
    placeholder: string;
}

export default function TextArea(props: TextArea) {
    return (
        <label className="flex flex-col gap-1">
            {props.children}
            <textarea className= { twMerge("w-fit border rounded-sm px-2 py-1", props.className) } name={props.name} placeholder={props.placeholder}></textarea>
        </label>
    );
}