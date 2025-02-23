import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TextInput {
    children: ReactNode;
    className?: string;
    type: string;
    name: string;
    placeholder: string;
}

export default function TextInput(props: TextInput) {
    return (
        <label className="flex flex-col gap-1">
            {props.children}
            <input className={twMerge("w-fit h-10 border rounded-sm px-2 py-1 border-gray-400", props.className)}
                   type={props.type}
                   name={props.name}
                   placeholder={props.placeholder}/>
        </label>
    );
}