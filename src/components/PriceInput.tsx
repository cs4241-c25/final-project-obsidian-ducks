import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TextInput {
    className?: string;
    type: string;
    name: string;
    placeholder: string;
    onChange:  React.ChangeEventHandler<HTMLInputElement>;
}

export default function TextInput(props: TextInput) {
    return (
            <input className={twMerge("w-full h-10 border rounded-sm px-2 py-1 border-gray-400", props.className)}
                   type={props.type}
                   name={props.name}
                   placeholder={props.placeholder}
                   onChange={props.onChange}/>
    );
}