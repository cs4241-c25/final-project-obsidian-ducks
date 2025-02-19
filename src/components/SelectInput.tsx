'use client'
import {ChangeEventHandler, ReactNode, useState} from "react";

interface SelectInput {
    children: ReactNode;
    onChange?: ChangeEventHandler<HTMLSelectElement>;
    name: string;
    options: string[];
}

export default function SelectInput(props: SelectInput) {
    const [selectedOption, setSelectedOption] = useState<string>(props.options[0] || ''); // Default to the first option if available

    const handleSelectChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setSelectedOption(e.target.value);  // Update the local state
        if (props.onChange) {
            props.onChange(e);
        }
    };

    return (

        <label  className={"flex flex-col border"}>
            {props.children}
            <select defaultValue="" onChange={handleSelectChange} name={props.name}>
                <option value=""  disabled={true}>Select an Option</option>
                {props.options.map(option =>
                    <option key={option} value={option}>{option}</option>
                )}
            </select>
        </label>
    );
}