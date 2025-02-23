import React from "react";

interface FilterCategory {
    type: string;
    name: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function FilterCategory(props: FilterCategory){
    return (
        <label className={`pl-2 py-2 rounded-lg shadow-md hover:bg-auburn-100 hover:scale-110 duration-125 ease-in-out}`}>
                <input type={props.type} name={props.name} value={props.name} onChange={props.onChange}/>
            <span className="pl-2">
        {props.name}
            </span>
        </label>
    );
}