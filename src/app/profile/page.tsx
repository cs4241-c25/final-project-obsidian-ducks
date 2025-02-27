"use client";
import Link from "next/link";
import Button from "@/components/Button";
import {useSession} from 'next-auth/react';
import {useRouter} from "next/navigation";
import ItemPost from "../ItemPost";
import {useEffect, useState} from "react";
import {Item} from "@/lib/types";


export default function ProfilePage() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<Item[]>([]);
    const [likes, setLikes] = useState<Item[]>([]);
    const [tabFilter, setTab] = useState("");

    function handleTab(tab: string){
        setTab(tab);
        console.log(tabFilter);
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
            console.log("useEffect ", tabFilter);
        }
    }, [status, tabFilter])

    return (
        <main>
            <h1>Profile Page</h1>
            {status === 'authenticated' ? (
                <div className="flex flex-col justify-center items-center">
                    <h1>Welcome, {session.user?.name}</h1>


                    <div>
                        <Button className="font-bold text-2xl bg-gray-200 text-black" type={"button"} onClick={() => handleTab("Posts")}>
                            Postings
                        </Button>
                        <div className="flex flex-wrap gap-9.5">
                        {posts.map((item) =>
                                <ItemPost key={item.id} id={item.id} title={item.title} category={item.category}
                                          price={item.price} image={item.image}/>)}
                        </div>
                    </div>

                    <div>
                        <Button className="font-bold text-2xl bg-gray-200 text-black" type={"button"} onClick={() => handleTab("Likes")}>
                            Likes
                        </Button>
                        <div className="flex flex-wrap gap-9.5">
                                {likes.map((item) =>
                                    <ItemPost key={item.id} id={item.id} title={item.title} category={item.category}
                                              price={item.price} image={item.image}/>)}
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
