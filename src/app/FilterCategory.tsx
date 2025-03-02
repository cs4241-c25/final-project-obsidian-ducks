import { ChangeEventHandler } from "react";

interface FilterCategory {
    type: string;
    name: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function FilterCategory(props: FilterCategory){
    return (
        <label className="flex items-center gap-3 px-4 py-2 w-fit rounded-lg shadow-md cursor-pointer">
            <input className="accent-crimson-500" type={"checkbox"} name={props.name} value={props.name} onChange={props.onChange} />
            <span>{props.name}</span>
        </label>
    );
}