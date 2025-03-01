"use client";
import Link from "next/link";
import Button from "@/components/Button";
import {useSession} from 'next-auth/react';
import {useRouter} from "next/navigation";
import ItemPost from "../ItemPost";
import React, {useEffect, useState} from "react";
import {Item} from "@/lib/types";
import FileDropzone from "@/components/FileDropzone";
import {getServerSession} from "next-auth";

export default function ProfilePage() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<Item[]>([]);
    const [likes, setLikes] = useState<Item[]>([]);
    const [tabFilter, setTab] = useState("Posts");

    async function postPicture(formData: FormData) {
        const sellForm = formData
        sellForm.append("username", session.user?.name);
        try {
            const response = await fetch("http://localhost:3000/api/picture", {
                method: "POST",
                body: sellForm
            });
            if (!response.ok) throw new Error(response.statusText);
        } catch (e) {
            console.error(e);
        }
    }


    function handleTab(tab: string){
        setTab(tab);
    }

    function renderTab(){
        if(tabFilter === "Posts"){
            return (
                posts.map((item) =>
                        <ItemPost key={item.id} id={item.id} title={item.title} category={item.category}
                                  price={item.price} image={item.image}/>)
            )
        } else if (tabFilter === "Likes") {
            return (
                likes.map((item) =>
                <ItemPost key={item.id} id={item.id} title={item.title} category={item.category}
                          price={item.price} image={item.image}/>))
        }
    }
    async function getPostings(){
        try {
            if(!session?.user?.name){
                return;
            }
            const response = await fetch("http://localhost:3000/api/filter", {
                method: "POST",
                body: JSON.stringify(session.user.name)
            });
            if (!response.ok) throw new Error(response.statusText);
            const data = await response.json();
            const formattedData = data.map(item => ({
                id: item._id.toString(),
                title: item.title,
                price: item.price,
                category: item.category,
                description: item.description,
                image: item.image
            }));
            setPosts(formattedData);
        } catch (e) {
            console.error(e);
        }
    }

    async function getLikes(){
        try {
            if(!session?.user?.name){
                return;
            }
            const response = await fetch("http://localhost:3000/api/profile", {
                method: "POST",
                body: JSON.stringify(session.user.name)
            });
            if (!response.ok) throw new Error(response.statusText);
            const data = await response.json();
            const formattedData = data.map(item => ({
                id: item._id.toString(),
                title: item.title,
                price: item.price,
                category: item.category,
                description: item.description,
                image: item.image
            }));
            setLikes(formattedData);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (status === "authenticated") {
            getPostings().then(() => {
            });
            getLikes().then(() => {
            })
        }
    }, [status, tabFilter])


    return (
        <main>
            {status === 'authenticated' ? (
                <div>
                    <div className="flex flex-col md:py-20 md:px-60">
                        <div className="flex flex-row items-center ">
                            <form action={postPicture}>
                                <FileDropzone className="w-50 h-50"/>
                                <Button className="w-25 grow" type="submit">Submit</Button>
                            </form>
                            <img
                                className="w-[250px] h-[250px] rounded-sm object-cover hover:scale-105 duration-150 ease-in-out "
                                src={"https://fly.storage.tigris.dev/wpi-buys1/watch.jpg"} alt={"test"}/>
                            <div className="pl-4">
                                <h1 className="text-2xl font-bold">{session.user?.name}</h1>
                                <h2 className="text-lg">Posts: {posts.length}</h2>
                                <h2 className="text-lg">Likes: {likes.length}</h2>
                            </div>
                        </div>

                        <div>
                            <div className="flex my-4 gap-x-2 border-b-2 w-fit">
                                <Button
                                    className={`text-2xl bg-transparent text-black hover:bg-gray-100 hover:scale-110 duration-125 ease-in-out${tabFilter === "Posts" ? ' bg-gray-100 scale-110 ': ' '}`} type={"button"}
                                            onClick={() => handleTab("Posts")}>
                                    Postings
                                </Button>
                                <Button className={`text-2xl bg-transparent text-black hover:bg-gray-100 hover:scale-110 duration-125 ease-in-out ${tabFilter === "Likes" ? ' bg-gray-100 scale-110 ': ' '}`} type={"button"}
                                        onClick={() => handleTab("Likes")}>
                                    Likes
                                </Button>
                            </div>
                            <div className="flex sm:justify-center md:justify-start flex-wrap gap-9.5 sm:pl-4 md:pl-0">
                                    {renderTab()}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div>
                    <p>Please log in to view your profile.</p>
                        <Link href="/login">
                            <Button type={"button"}>Login</Button>
                        </Link>
                    </div>

                </div>
            )}


        </main>
    );
}
