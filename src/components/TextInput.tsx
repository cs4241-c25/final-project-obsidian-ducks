import { ReactNode } from "react";

interface TextInput {
    children: ReactNode;
    type: string;
    name: string;
    placeholder: string;
    width?: string;
}

export default function TextInput(props: TextInput) {
    return (
        <label className="flex flex-col">
            {props.children}
            <input className={ (props.width ? props.width : "w-fit") + " h-10 border rounded-sm px-2 py-1" }
                   type={props.type}
                   name={props.name}
                   placeholder={props.placeholder}/>
        </label>
    );
}