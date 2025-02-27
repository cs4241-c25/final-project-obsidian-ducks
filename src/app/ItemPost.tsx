import Link from "next/link";
import Button from "@/components/Button";
import {useSession} from "next-auth/react";
import React from "react";

interface ItemPost {
    id: string;
    title: string;
    category: string;
    price: number;
    image: string;
}

export default function ItemPost(props: ItemPost) {
    const {data: session} = useSession()
    const usernameSession = session?.user?.name

    async function handleLikes(itemID: string) {

        alert("liked!")
        if (window.location.pathname === "/favorites") {
            window.location.reload()
        }
        let data = {
            _id: itemID,
            username: usernameSession

        }
        try {
            const response = await fetch("http://localhost:3000/api/likes", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {'Content-type': 'application/json'}

            });
            const test = await response

        } catch (e) {
            console.error(e);
        }
    }
    return (
        <figure className="">
            <div className="relative">
                <Link href={`/listing/${props.id}`}>
                <img className="w-[250px] h-[250px] rounded-sm object-cover hover:scale-105 duration-150 ease-in-out" src={props.image} alt={props.title} />
                </Link>
                <Button type="button" className="absolute top-2 right-2 z-10 p-2 rounded-full shadow-md bg-white hover:bg-auburn-300" onClick={() => handleLikes(props.id)}>
                    <img src="/like.svg" alt="Heart Image" width={15} height={15}/>
                </Button>
            </div>
            <figcaption>
                <p className="font-semibold tracking-wider">${props.price}.00</p>
                <p className="opacity-75">{props.title}</p>
                <p className="opacity-75">{props.category}</p>
            </figcaption>
        </figure>
    );

}