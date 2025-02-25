"use client";
import { ChangeEvent, useRef, useState } from "react";

import FilterCategory from "./FilterCategory";
import ItemPost from "./ItemPost";
import SearchBar from "./SearchBar";
import PriceInput from "@/components/PriceInput"


import { Item, ITEM_CATEGORIES } from "@/lib/types";

interface ItemPosts {
    items: Item[];
}

export default function ItemsSection(props: ItemPosts) {
    const [items, setItems] = useState(props.items);
    const filters = useRef<string[]>([]);
    const query = useRef<string>("");
    const [search, setSearch] = useState<string>("");
    const [filteredPrice, setFilteredPrice] = useState({
        min: 0,
        max: 500,
    });

    function filterBySearch(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        if(e.target.value === "" && filters.current.length === 0) {
            setItems(props.items);
        } else if (filters.current.length !== 0) {
            if(e.target.value === "") {
                const searchedItems = props.items.filter(item => {
                    return filters.current.includes(item.category);
                });
                setItems(searchedItems);
            } else {
                const searchedItems = props.items.filter(item => {
                    return item.title.includes(e.target.value) && filters.current.includes(item.category);
                });
                setItems(searchedItems);
            }
        }
    }

    function filterByCategory(e: ChangeEvent<HTMLInputElement>) {
        setSearch("");
        if (e.target.checked) {
            filters.current.push(e.target.value); // Update filters list
            const filteredItems = props.items.filter(item => filters.current.includes(item.category)); // Apply filter categories
            setItems(filteredItems);
        } else if (!e.target.checked){
                filters.current = filters.current.filter(filter => filter !== e.target.value);
                if(filters.current.length === 0) {
                    setItems(props.items);
                } else {
                const filteredItems = props.items.filter(item => filters.current.includes(item.category)); // Apply filter categories
                setItems(filteredItems);
            }
        }
    }

    function handlePrice(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch("");
        if (e.target.name === "min") {
            if(e.target.value === ""){
                setFilteredPrice(prevVal => ({...prevVal, min: 0}));
            } else {
                setFilteredPrice(prevVal => ({...prevVal, min: Number(e.target.value)}));
            }
        } else if (e.target.name === "max"){
            if(e.target.value === ""){
                setFilteredPrice(prevVal => ({...prevVal, max: 500}));
            } else {
                setFilteredPrice(prevVal => ({...prevVal, max: Number(e.target.value)}));
            }
        }
    }


    return (
        <section>
            <div className="flex justify-center">
                <SearchBar value={search} onChange={filterBySearch}/>
            </div>
            <div className="flex justify-center gap-x-2 py-4">
                    {ITEM_CATEGORIES.map((category) => (
                        <FilterCategory key={category} type={"checkbox"} name={category} onChange={filterByCategory}/>
                    ))}
                    <div className="flex gap-x-1">
                        <h1 className="place-self-center">$</h1>
                        <span>
                        <PriceInput className="w-17" type={"number"} name={"min"} placeholder={"Min"}
                                    onChange={handlePrice}></PriceInput>
                    </span>
                        <h1 className="content-center px-2">-</h1>
                        <h1 className="place-self-center">$</h1>
                        <span>
                        <PriceInput className="w-17" type={"number"} name={"max"} placeholder={"Max"}
                                    onChange={handlePrice}></PriceInput>
                    </span>
                    </div>
            </div>
            <div className="flex justify-center">
                <div className="w-3/4 flex flex-wrap gap-9.5">
                    {items.map((item) =>
                        <ItemPost key={item.id} id={item.id} title={item.title} category={item.category}
                                  price={item.price} image={item.image}/>)}
                </div>
            </div>
        </section>
    );
}