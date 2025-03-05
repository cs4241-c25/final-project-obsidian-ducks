"use client";
import Button from "@/components/Button";
import {useSession} from 'next-auth/react';
import {useRouter} from "next/navigation";
import ItemPost from "../ItemPost";
import React, {useEffect, useState} from "react";
import {Item} from "@/lib/types";
import FileDropzone from "@/components/FileDropzone";
import { Session } from "@/lib/types";
import FavoritePost from "@/components/FavoritePost";
import Like from "@/models/Like";


export default function ProfilePage() {
    const {data: session, status} = useSession() as {data: Session, status: string};
    const router = useRouter();
    const [posts, setPosts] = useState<Item[]>([]);
    const [likes, setLikes] = useState<Item[]>([]);
    const [tabFilter, setTab] = useState("Posts");
    const [profile, setProfile] = useState();
    const [fill, setFill] = useState("black")
    useEffect(() => {
        if (status === "unauthenticated"){
            router.push("/login");
        }
    }, [status, router]);
    const removeFavorite = (itemID: string) => {
        // Update the likes array by filtering out the item that was removed
        setLikes(likes.filter(item => item.id !== itemID));

    };

    async function postPicture(formData: FormData) {
        const sellForm = formData;
        if (session == null) return;
        sellForm.append("username", session.user.name);
        try {
            const response = await fetch("/api/picture", {
                method: "POST",
                body: sellForm
            });
            if (!response.ok) throw new Error(response.statusText);
            // router.push("/profile");
            const data:{url:string} = await response.json()
            setFill("black");
            setProfile(data.url);
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
                <FavoritePost key={item.id} id={item.id} title={item.title} category={item.category}
                         onRemove={() => removeFavorite(item.id)} price={item.price} image={item.image}/>))
        }
    }
    async function getPostings(){
        try {
            if(!session?.user?.name){
                return;
            }
            const response = await fetch("/api/filter", {
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
            const response = await fetch("/api/profile", {
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

    async function getUser(){
        try {
            if(!session?.user?.name){
                return;
            }
            const response = await fetch("/api/image", {
                method: "POST",
                body: JSON.stringify(session.user?.name),
            });
            if (!response.ok) throw new Error(response.statusText);
            const data = await response.json();
            const image = data.profileImage;
            setProfile(image);
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
            getUser().then(() => {

            })
        }
    }, [status, tabFilter, profile])


    return (
        <main>
            {status === 'authenticated' ? (
                <div>
                    <div className="flex flex-col py-10 md:py-20 md:px-60">
                        <div className="flex flex-col sm:flex-col md:flex-row md:items-center">
                            <div className="flex flex-col items-center justify-center relative group">
                                <form action={postPicture} className="">
                                    <FileDropzone
                                        className="w-[225px] h-[225px] top-10 absolute rounded-full opacity-0 group-hover:opacity-0 group-hover:pointer-events-auto pointer-events-none duration-200 z-10"
                                        files={[]}/>
                                    {/*  <Button className="" type="submit" onClick={() => {
                                        window.location.reload();

                                    }}>*/}

                                    {/*         <svg onClick={() => {
                                            window.location.reload();

                                        }} className={"grow hover:scale-110 absolute top-0 right-5 sm:right-45 md:-right-7 z-20 p-0"} width="50px" height="50px" viewBox="0 0 24 24" fill="pink"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M6.75 6L7.5 5.25H16.5L17.25 6V19.3162L12 16.2051L6.75 19.3162V6ZM8.25 6.75V16.6838L12 14.4615L15.75 16.6838V6.75H8.25Z"
                                                  fill="red"/>
                                        </svg>*/}

                                    <Button type={"submit"} className={"grow bg-transparent hover:bg-transparent hover:scale-110 absolute top-0 right-5 sm:right-45 md:-right-7 z-20 p-0"} onClick={() => {
                                        setFill("green")
                                        // window.location.reload()
                                    }}>
                                    <svg fill={fill}  width="30" height="30" viewBox="0 0 32 32"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="m16 0c8.836556 0 16 7.163444 16 16s-7.163444 16-16 16-16-7.163444-16-16 7.163444-16 16-16zm0 2c-7.7319865 0-14 6.2680135-14 14s6.2680135 14 14 14 14-6.2680135 14-14-6.2680135-14-14-14zm6.6208153 9.8786797c.3905243.3905242.3905243 1.0236892 0 1.4142135l-7.0710678 7.0710678c-.3626297.3626297-.9344751.3885319-1.3269928.0777064l-.0872208-.0777064-4.24264068-4.2426407c-.39052429-.3905242-.39052429-1.0236892 0-1.4142135.39052428-.3905243 1.02368928-.3905243 1.41421358 0l3.5348268 3.5348268 6.3646681-6.3632539c.3905243-.3905243 1.0236893-.3905243 1.4142136 0z"/>
                                      <title>Save</title>
                                    </svg>
                                    </Button>
                                    {/*</Button>*/}
                                </form>
                                <img
                                    className=" w-[225px] h-[225px] object-cover duration-150 ease-in-out rounded-full group-hover:scale-105"
                                    src={profile} alt={"Profile Image"}/>
                            </div>
                            <div className="pl-4 flex flex-col items-center md:items-start">
                                <h1 className="sm:text-lg md:text-2xl font-bold">{session.user?.name}</h1>
                                <h2 className="md:text-lg">Posts: {posts.length}</h2>
                                <h2 className="md:text-lg">Likes: {likes.length}</h2>
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col">
                                <div className="flex justify-center mx-auto md:mx-0 sm:justify-center md:justify-start pt-2 my-4 gap-x-2 border-b-2 w-fit">
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
                                <div className="flex justify-center sm:justify-center md:justify-start flex-wrap gap-9.5 sm:pl-4 md:pl-0">
                                        {renderTab()}
                                </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                </div>
            )}


        </main>
    );
}
