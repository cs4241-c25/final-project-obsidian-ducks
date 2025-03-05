import Image from "next/image";
import Button from "@/components/Button";
import {useSession} from "next-auth/react";
import React, {use, useRef, useState} from "react";
import Link from "next/link";

interface ItemPost {
    id: string;
    title: string;
    category: string;
    price: number;
    image: string;
    onRemove?: (itemID: string) => void
}

export default function FavoritePost(props: ItemPost) {
    const {data: session} = useSession()
    const usernameSession = session?.user?.name

    async function handleLikes(itemID: string) {

        let data = {
            _id: itemID,
            username: usernameSession

        }
        try {
            const response = await fetch("/api/likes", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {'Content-type': 'application/json'}

            });
            const test = await response

            console.log(test.bodyUsed)

            if(test.bodyUsed === false){
                if (props.onRemove) {
                    props.onRemove(itemID)
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
    return (
        <figure className="relative">
            <Link href={`/listing/${props.id}`}>
                <img className="w-[250px] h-[250px] rounded-sm object-cover hover:scale-105 duration-150 ease-in-out" src={props.image} alt={props.title} />
            </Link>
            <figcaption>
                <p className="font-semibold tracking-wider">${props.price}.00</p>
                <p>{props.title}</p>
                <p className="opacity-75">{props.category}</p>
            </figcaption>
            <div>

                <Button onClick={() => handleLikes(props.id)} type="button"
                        className="absolute top-2 right-2 z-10 p-2 rounded-full shadow-md bg-white hover:bg-auburn-300">
                    <Image   src="/remove.svg" alt="Heart Image" width={15}
                             height={15}/>
                </Button>
            </div>
        </figure>
    );

}