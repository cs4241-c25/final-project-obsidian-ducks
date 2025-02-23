"use client"

import Post from "@/components/Post";
import SearchBar from "@/components/SearchBar";
import FilterCategory from "@/components/FilterCategory";
import { ITEM_CATEGORIES } from "@/lib/types";
import React, {useEffect, useState} from "react";


export default function Home() {
    // const [posts, setPosts] = useState([]);
    // async function getPosts() {
    //     try {
    //         const response = await fetch("http://localhost:3000/api/items", {
    //             method: "GET",
    //         });
    //         if (!response.ok) throw new Error(response.statusText);
    //         const data = await response.json()
    //         if(filteredList.length > 0){
    //             setPosts(filteredList);
    //         } else {
    //             setPosts(data);
    //         }
    //     } catch (e) {
    //         console.error(e);
    //         throw e;
    //     }
    // }
    // const [filteredList, setFilteredList] = useState([]);
    // async function handleFiltered(e: React.ChangeEvent<HTMLInputElement>) {
    //     try {
    //         if(!e.target.checked){
    //             let filteredWords = filteredList.filter((words) => words.category !== e.target.name);
    //             setFilteredList(filteredWords);
    //         } else {
    //             const response = await fetch("http://localhost:3000/api/filter", {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(e.target.name),
    //             });
    //             if (!response.ok) throw new Error(response.statusText);
    //             const data = await response.json();
    //             setFilteredList(prevList => [...prevList, ...data]);
    //         }
    //     } catch (e) {
    //         console.error(e);
    //         throw e;
    //     }
    // }
    //
    // useEffect(() => {
    //     getPosts().then();
    // }, [filteredList])
    // function handleSearch(){
    // }

    return (
        <main>
            {/*<div className="grid grid-cols-1 md:grid-cols-4 w-full">*/}
            {/*    <div className="w-full md:w-70 h-auto pl-4 pt-4 border-r-2">*/}
            {/*        <SearchBar onChange={handleSearch}/>*/}
            {/*        <div className="flex flex-col mr-8 gap-y-2">*/}
            {/*            <label className="font-bold text-xl pt-4">Categories</label>*/}
            {/*            {ITEM_CATEGORIES.map((category) => (*/}
            {/*                <FilterCategory key={category} type={"checkbox"} name={category} onChange={handleFiltered}/>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 col-span-3 gap-10 mt-10">*/}
            {/*        {posts.map((post) => (*/}
            {/*            <Post key={post._id} _id={post._id} title={post.title} description={post.description} category={post.category}*/}
            {/*                  price={post.price} image={post.image}/>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </main>
    );
}
