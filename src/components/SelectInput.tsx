import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface SelectInput {
    className?: string;
    children: ReactNode;
    name: string;
    options: string[];
}

export default function SelectInput(props: SelectInput) {
    return (
        <label className="flex flex-col gap-1">
            <div>{props.children}</div>
            <select className={ twMerge("w-full h-10 border border-gray-400 rounded-sm", props.className)} name={props.name}>
                {props.options.map(option =>
                    <option key={option} value={option}>{option}</option>
                )}
            </select>
        </label>
    );
}