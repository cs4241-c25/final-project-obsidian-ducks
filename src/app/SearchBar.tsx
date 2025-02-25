import Image from "next/image";
import React from "react";

interface SearchBar {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}
export default function SearchBar(props: SearchBar){
    return (
        <div className="flex flex-col ">
            <label className="font-bold text-xl">Search Bar</label>
            <div className="relative w-fit border border-black p-2 items-center rounded-lg focus-within:bg-alice-blue-700  hover:bg-alice-blue-700">
                <input type="input" name="Search Bar" placeholder="Search here..." className="pr-6 focus:outline-none" onChange={props.onChange}/>
            </div>
        </div>
    )
}