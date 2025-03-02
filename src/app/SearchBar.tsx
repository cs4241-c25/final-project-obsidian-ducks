import { ChangeEventHandler } from "react";
import { IoMdSearch } from "react-icons/io";

interface SearchBar {
    value: string,
    onChange: ChangeEventHandler<HTMLInputElement>;
}
export default function SearchBar(props: SearchBar){
    return (
        <div className="w-[35vw] h-10 flex justify-center items-center gap-4 bg-onyx-100 rounded-lg opacity-80">
            <IoMdSearch/>
            <input className="field-sizing-content focus:outline-none" type="input" placeholder="Search for an item" value={props.value} onChange={props.onChange}/>
        </div>
    )
}