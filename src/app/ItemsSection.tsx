"use client";
import { ChangeEvent, useRef, useState } from "react";

import FilterCategory from "./FilterCategory";
import ItemPost from "./ItemPost";
import SearchBar from "./SearchBar";

import { Item, ITEM_CATEGORIES } from "@/lib/types";

interface ItemPosts {
    items: Item[];
}

export default function ItemsSection(props: ItemPosts) {
    const [items, setItems] = useState(props.items);
    const filters = useRef<string[]>([]);
    const query = useRef<string>("");

    function filterBySearch(e: ChangeEvent<HTMLInputElement>) {
        const searchedItems = props.items.filter(item => item.title.includes(e.target.value) && filters.current.includes(item.category)); // Apply search query
        setItems(searchedItems);
    }

    function filterByCategory(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            if (!filters.current.includes(e.target.value)) {
                filters.current.push(e.target.value); // Update filters list
            }
            const filteredItems = props.items.filter(item => filters.current.includes(item.category) && item.title.includes(query.current)); // Apply filter categories
            setItems(filteredItems);
        } else {
            setItems(props.items);
        }
    }

    return (
        <section>
            <div className="flex justify-center">
                <SearchBar onChange={filterBySearch} />
            </div>
            <div className="flex justify-center">
                <div className="flex mr-8 gap-x-2">
                    {ITEM_CATEGORIES.map((category) => (
                        <FilterCategory key={category} type={"checkbox"} name={category} onChange={filterByCategory}/>
                    ))}
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-3/4 flex flex-wrap gap-9.5">
                    {items.map((item) =>
                        <ItemPost key={item.id} id={item.id} title={item.title} category={item.category} price={item.price} image={item.image}/>)}
                </div>
            </div>
        </section>
    );
}