import Image from "next/image";

export default function SearchBar(){
    return (
        <div className="flex flex-col ">
            <label className="font-bold text-xl">Search Bar</label>
            <div className="relative w-fit border border-black p-2 items-center rounded-lg focus-within:border-alice-blue-950 focus-within:bg-alice-blue-700  hover:bg-alice-blue-700">
                <input type="input" name="Search Bar" placeholder="Search here..." className="pr-6 focus:outline-none"/>
                <div className="absolute top-2 right-2">
                    <Image src="/search.svg" alt="Search Logo" width={20} height={20} color="alice-blue-900"/>
                </div>
            </div>
        </div>
    )
}