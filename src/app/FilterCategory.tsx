import React from "react";

interface FilterCategory {
    type: string;
    name: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function FilterCategory(props: FilterCategory){
    return (
        <label className="flex gap-3 px-4 py-2 w-fit rounded-lg shadow-md hover:bg-auburn-100 hover:scale-110 duration-125 ease-in-out has-[:checked]:scale-110">
            <input type={props.type} name={props.name} value={props.name} onChange={props.onChange} className=""/>
            <span>{props.name}</span>
        </label>
    );
}