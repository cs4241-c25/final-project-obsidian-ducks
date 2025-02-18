import { ReactNode } from "react";

interface SelectInput {
    children: ReactNode;
    name: string;
    options: string[];
}

export default function SelectInput(props: SelectInput) {
    return (
        <label className={"flex flex-col border"}>
            {props.children}
            <select name={props.name}>
                {props.options.map(option =>
                    <option key={option} value={option}>{option}</option>
                )}
            </select>
        </label>
    );
}