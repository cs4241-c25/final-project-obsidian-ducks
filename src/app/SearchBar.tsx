import { ChangeEventHandler } from "react";
import { IoMdSearch } from "react-icons/io";

interface SearchBar {
    value: string,
    onChange: ChangeEventHandler<HTMLInputElement>;
}
export default function SearchBar(props: SearchBar){
    return (
        <label className="w-[35vw] h-10 flex justify-center items-center gap-4 bg-onyx-100 rounded-lg opacity-80 cursor-text">
            <IoMdSearch/>
            <input className="field-sizing-content focus:outline-none text-center" name="search-bar" type="input" placeholder="Search for an item" value={props.value} onChange={props.onChange}/>
        </label>
    )
}