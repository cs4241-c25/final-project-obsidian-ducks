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
    const min = useRef<number>(0);
    const max = useRef<number>(10000000);


    function filterBySearch(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        query.current = e.target.value.toLowerCase();
        if(e.target.value === "" && filters.current.length === 0) {
            const searchedItems = props.items.filter((item) => {
                const title = item.title.toLowerCase();
                return title.includes(e.target.value) && (min.current <= item.price && max.current >= item.price)
            });
            setItems(searchedItems);
        } else if (filters.current.length !== 0) {
            if(e.target.value === "") {
                const searchedItems = props.items.filter(item => {
                    return filters.current.includes(item.category) && (min.current <= item.price && max.current >= item.price);
                });
                setItems(searchedItems);
            } else {
                const searchedItems = props.items.filter(item => {
                    const title = item.title.toLowerCase();
                    return title.includes(query.current) && filters.current.includes(item.category) && (min.current <= item.price && max.current >= item.price);
                });
                setItems(searchedItems);
            }
        } else {
            const searchedItems = props.items.filter(item => {
                const title = item.title.toLowerCase();
                return title.includes(query.current) && (min.current <= item.price && max.current >= item.price);
            });
            console.log(searchedItems);
            setItems(searchedItems);
        }
    }

    function filterByCategory(e: ChangeEvent<HTMLInputElement>) {
        setSearch("");
        if (e.target.checked) {
            filters.current.push(e.target.value); // Update filters list
            const filteredItems = props.items.filter(item => filters.current.includes(item.category) && (min.current <= item.price && max.current >= item.price)); // Apply filter categories
            setItems(filteredItems);
        } else if (!e.target.checked){
                filters.current = filters.current.filter(filter => filter !== e.target.value);
                if(filters.current.length === 0) {
                    const filteredItems = props.items.filter(item => min.current <= item.price && max.current >= item.price); // Apply filter categories
                    setItems(filteredItems);
                } else {
                const filteredItems = props.items.filter(item => filters.current.includes(item.category) && (min.current <= item.price && max.current >= item.price)); // Apply filter categories
                setItems(filteredItems);
            }
        }
    }

    function handlePrice(e: ChangeEvent<HTMLInputElement>) {
        setSearch("");
        if (e.target.name === "min") {
            if(e.target.value === ""){
                min.current = 0;
            } else {
                min.current = Number(e.target.value);
            }
        } else if (e.target.name === "max"){
            if(e.target.value === ""){
                max.current = 500;
            } else {
                max.current = Number(e.target.value);
            }
        }
        if(filters.current.length > 0 ){
            const filteredItems = props.items.filter(item => filters.current.includes(item.category) && (min.current <= item.price && max.current >= item.price));
            setItems(filteredItems);
        } else {
            const filteredItems = props.items.filter(item => (min.current <= item.price && max.current >= item.price));
            setItems(filteredItems);
        }
    }


    return (
        <section>
            <div className="flex justify-center">
                <SearchBar value={search} onChange={filterBySearch}/>
            </div>
            <div className="flex lg:justify-center gap-x-3 py-4 overflow-visible overflow-x-auto">
                    {ITEM_CATEGORIES.map((category) => (
                        <FilterCategory key={category} type={"checkbox"} name={category} onChange={filterByCategory}/>
                    ))}
                    <div className="flex gap-x-1 items-center">
                        <h1>$</h1>
                        <span>
                        <PriceInput className="w-17" type={"number"} name={"min"} placeholder={"Min"}
                                    onChange={handlePrice}></PriceInput>
                    </span>
                        <h1 className="content-center px-2">-</h1>
                        <h1>$</h1>
                        <span>
                        <PriceInput className="w-17" type={"number"} name={"max"} placeholder={"Max"}
                                    onChange={handlePrice}></PriceInput>
                    </span>
                    </div>
            </div>
            <div className="flex justify-center">
                <div className="w-3/4 justify-center flex flex-wrap gap-9.5 min-h-[700px]">
                    {items.map((item) =>
                        <ItemPost key={item.id} id={item.id} title={item.title} category={item.category}
                                  price={item.price} image={item.image}/>)}
                </div>
            </div>
        </section>
    );
}