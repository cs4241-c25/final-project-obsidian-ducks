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
    const filters = useRef<string[]>(ITEM_CATEGORIES);
    const query = useRef<string>("");

    function filterItems() {
        const filteredItems = props.items.filter(item =>
            item.title.includes(query.current) && filters.current.includes(item.category)
        );
        setItems(filteredItems);
    }

    function setFilters(e: ChangeEvent<HTMLInputElement>) {
        const { checked, value } = e.target;

        if (checked && filters.current.length === ITEM_CATEGORIES.length) {
            // Remove initial filters, keeping the selected one
            filters.current = [value];
        } else if (checked) {
            // Apply filter to existing list of filters
            filters.current.push(value);
        } else {
            // Remove a previously selected filter
            filters.current = filters.current.filter(filter =>
                filter !== e.target.value // Removes a previously applied filter
            );
        }

        // If no selected filters, show all items
        if (!filters.current.length) {
            filters.current = ITEM_CATEGORIES;
        }

        filterItems();
    }

    return (
        <section>
            <div className="flex justify-center">
                <SearchBar onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    query.current = e.target.value;
                    filterItems();
                }}/>
            </div>
            <div className="flex justify-center">
                <div className="flex mr-8 gap-x-2">
                    {ITEM_CATEGORIES.map((category) => (
                        <FilterCategory key={category} type={"checkbox"} name={category}
                                        onChange={setFilters}/>
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