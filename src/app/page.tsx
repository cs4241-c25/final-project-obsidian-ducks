"use client"

import Post from "@/components/Post";
import SearchBar from "@/components/SearchBar";
import FilterCategory from "@/components/FilterCategory";
import {ITEM_CATEGORIES} from "@/lib/types";
import React, {useEffect, useState} from "react";
import TextInput from "@/components/inputs/TextInput";

interface Post {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
}

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [originalPosts, setOriginalPosts] = useState<Post[]>([]);
    const [filters, setFilters] = useState<string[]>([]);
    const [search, setSearch] = useState<string>("");
    const [filteredPrice, setFilteredPrice] = useState({
        min: 0,
        max: 500,
    });

    async function getPosts() {
        try {
            const response = await fetch("http://localhost:3000/api/items", {
                method: "GET",
            });
            if (!response.ok) throw new Error(response.statusText);
            const data = await response.json();
            setPosts(data);
            setOriginalPosts(data);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async function handleFiltered(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch("");
        if (e.target.checked) {
            const newFilters = [e.target.value, ...filters];
            setFilters(newFilters);
        } else if (!e.target.checked){
            let filteredCategories = filters.filter((category) => category !== e.target.name);
            setFilters(filteredCategories);
        }
    }

    async function handlePrice(e: React.ChangeEvent<HTMLInputElement>) {
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

    async function handleSearch(e: React.ChangeEvent<HTMLInputElement>){
        const searchWord = e.target.value.toLowerCase();
        setSearch(searchWord);
        const filtered = posts.filter((post) => post.title.toLowerCase().includes(searchWord));
        setPosts(filtered);
        if (e.target.value === "") await getPosts();
    }

    useEffect(() => {
        getPosts().then(() =>{
        });
    }, []);

    useEffect(() => {
        if (filters.length > 0) {
            let newData = originalPosts.filter(post => filters.includes(post.category));
            setPosts(newData.filter((item) => {return item.price >= filteredPrice.min && item.price <= filteredPrice.max}));
        } else {
            let newData = originalPosts.filter((item) => {return item.price >= filteredPrice.min && item.price <= filteredPrice.max})
            setPosts(newData);
        }
    }, [filters, filteredPrice, originalPosts]);

    return (
        <main>
            <div className="grid grid-cols-1 md:grid-cols-4 w-full">
                <div className="w-full md:w-70 h-auto pl-4 pt-4 border-r-2">
                    <SearchBar onChange={handleSearch} value={search}/>
                    <div className="flex flex-col mr-8 gap-y-2">
                        <label className="font-bold text-xl pt-4">Categories</label>
                        {ITEM_CATEGORIES.map((category) => (
                            <FilterCategory key={category} type={"checkbox"} name={category} value={search} onChange={handleFiltered}/>
                        ))}
                    </div>
                    <div className="flex flex-col mr-8">
                    <label className="font-bold text-xl pt-4">Price Range</label>
                        <div className="flex pt-2 gap-x-1">
                            <h1 className="place-self-center">$</h1>
                            <span>
                            <TextInput className="w-17" type={"number"} name={"min"} placeholder={"Min"} onChange={handlePrice}></TextInput>
                            </span>
                            <h1 className="content-center px-2">-</h1>
                            <h1 className="place-self-center">$</h1>
                            <span>
                            <TextInput className="w-17" type={"number"} name={"max"} placeholder={"Max"} onChange={handlePrice}></TextInput>
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
