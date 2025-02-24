"use client"

import Post from "@/components/Post";
import SearchBar from "@/components/SearchBar";
import FilterCategory from "@/components/FilterCategory";
import {ITEM_CATEGORIES} from "@/lib/types";
import React, {useEffect, useState} from "react";
import TextInput from "@/components/inputs/TextInput";

export default function Home() {
    const [posts, setPosts] = useState([]);
    async function getPosts() {
        try {
            const response = await fetch("http://localhost:3000/api/items", {
                method: "GET",
            });
            if (!response.ok) throw new Error(response.statusText);
            const data = await response.json();
            if(filteredCategory.length > 0){
                let newData = filteredList.filter((price) => price.price >= filteredPrice.min && price.price <= filteredPrice.max);
                setPosts(newData);
            } else {
                let newData = data.filter((price) => price.price >= filteredPrice.min && price.price <= filteredPrice.max);
                setPosts(newData);
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    const [filteredList, setFilteredList] = useState([]);
    const [filteredCategory, setFilteredCategory] = useState([]);
    const [filteredPrice, setFilteredPrice] = useState({
        min: 0,
        max: 500,
    });

    async function handleFiltered(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            if (e.target.name === "min"){
                setFilteredPrice(prevVal => ({...prevVal, min: Number(e.target.value)}));
            } else if (e.target.name === "max"){
                setFilteredPrice(prevVal => ({...prevVal, max: Number(e.target.value)}));
            }
            if(!e.target.checked && isNaN(Number(e.target.value))){
                let filteredWords = filteredList.filter((words) => words.category !== e.target.name);
                let filteredCategories = filteredCategory.filter((category) => category !== e.target.name);
                setFilteredList(filteredWords);
                setFilteredCategory(filteredCategories)
            } else {
                const response = await fetch("http://localhost:3000/api/filter", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({name: e.target.name, value: e.target.value}),
                });
                if (!response.ok) throw new Error(response.statusText);
                const data = await response.json();
                let newData = data.filter((price) => price.price >= filteredPrice.min && price.price <= filteredPrice.max);
                console.log(filteredPrice.min, filteredPrice.max);
                setFilteredList(prevList => [...prevList, ...newData]);
                setFilteredCategory(prevList => [...prevList, e.target.name]);
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    useEffect(() => {
        getPosts().then();
    }, [filteredList, filteredPrice])
    function handleSearch(){
    }

    return (
        <main>
            <div className="grid grid-cols-1 md:grid-cols-4 w-full">
                <div className="w-full md:w-70 h-auto pl-4 pt-4 border-r-2">
                    <SearchBar onChange={handleSearch}/>
                    <div className="flex flex-col mr-8 gap-y-2">
                        <label className="font-bold text-xl pt-4">Categories</label>
                        {ITEM_CATEGORIES.map((category) => (
                            <FilterCategory key={category} type={"checkbox"} name={category} onChange={handleFiltered}/>
                        ))}
                    </div>
                    <div className="flex flex-col mr-8">
                    <label className="font-bold text-xl pt-4">Price Range</label>
                        <div className="flex pt-2 gap-x-1">
                            <h1 className="place-self-center">$</h1>
                            <span>
                            <TextInput className="w-17" type={"number"} name={"min"} placeholder={"Min"} onChange={handleFiltered}></TextInput>
                            </span>
                            <h1 className="content-center px-2">-</h1>
                            <h1 className="place-self-center">$</h1>
                            <span>
                            <TextInput className="w-17" type={"number"} name={"max"} placeholder={"Max"} onChange={handleFiltered}></TextInput>
                                </span>
                        </div>
                    </div>

                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 col-span-3 gap-10 mt-10">
                    {posts.map((post) => (
                        <Post key={post._id} _id={post._id} title={post.title} description={post.description} category={post.category}
                              price={post.price} image={post.image}/>
                    ))}
                </div>
            </div>
        </main>
    );
}
