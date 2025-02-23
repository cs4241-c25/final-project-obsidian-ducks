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
            {props.children}
            <select className={ twMerge("w-fit h-10 border border-gray-400 rounded-sm", props.className)} name={props.name}>
                {props.options.map(option =>
                    <option key={option} value={option}>{option}</option>
                )}
            </select>
        </label>
    );
}