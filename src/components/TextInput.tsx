import { ReactNode } from "react";

interface TextInput {
    children: ReactNode;
    type: string;
    name: string;
    placeholder: string;
}

export default function TextInput(props: TextInput) {
    return (
        <label className={"flex flex-col border"}>
            {props.children}
            <input type={props.type} name={"props.name"} placeholder={props.placeholder}/>
        </label>
    );
}