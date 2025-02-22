import { ReactNode } from "react";

interface TextInput {
    children: ReactNode;
    type: string;
    name: string;
    placeholder: string;
}

export default function TextInput(props: TextInput) {
    return (
        <label className="flex flex-col">
            {props.children}
            <input className="w-2xs h-8" type={props.type} name={props.name} placeholder={props.placeholder}/>
        </label>
    );
}