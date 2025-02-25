import Image from "next/image";
import React from "react";

interface SearchBar {
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}
export default function SearchBar(props: SearchBar){
    return (
        <div className="relative w-fit bg-gray-100 px-14 p-2 items-center rounded-lg focus-within:bg-alice-blue-700  hover:bg-alice-blue-700">
            <input type="input" name="Search Bar" placeholder="Search for an item" className="pr-6 focus:outline-none placeholder: text-center"  value={props.value} onChange={props.onChange}/>
            <div className="absolute top-2 right-2">
                <Image src="/search.svg" alt="Search Logo" width={20} height={20} color="alice-blue-900"/>
            </div>
        </div>
    )
}