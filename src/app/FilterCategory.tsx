import { ChangeEventHandler } from "react";

interface FilterCategory {
    type: string;
    name: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function FilterCategory(props: FilterCategory){
    return (
        <label className={`px-4 py-2 w-fit rounded-lg shadow-md hover:bg-auburn-100 hover:scale-110 duration-125 ease-in-out}`}>
            <input type={props.type} name={props.name} value={props.name} onChange={props.onChange}/>
            <span className="pl-2">
                {props.name}
            </span>
        </label>
    );
}