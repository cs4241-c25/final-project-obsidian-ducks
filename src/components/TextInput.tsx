import React, {ChangeEventHandler, ReactNode} from "react";

interface TextInput {
    children: ReactNode;
    onChange?: ChangeEventHandler<HTMLInputElement>
    type: string;
    name: string;
    placeholder: string;
}

export default function TextInput(props: TextInput) {


    return (
        <label className={"flex flex-col border"}>
            {props.children}
            <input onChange={props.onChange} type={props.type} name={"props.name"} placeholder={props.placeholder}/>
        </label>
    );
}