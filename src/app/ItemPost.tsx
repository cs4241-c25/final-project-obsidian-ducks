import Link from "next/link";
import Button from "@/components/Button";
import {useSession} from "next-auth/react";
import React, {useState} from "react";
import LikeButton from "@/components/LikeButton";

interface ItemPost {
    id: string;
    title: string;
    category: string;
    price: number;
    image: string;
}

export default function ItemPost(props: ItemPost) {
    return (
        <figure className="flex flex-col gap-1">
            <div className="relative">
                <Link href={`/listing/${props.id}`}>
                    <img
                        className="w-[250px] h-[250px] rounded-sm object-cover hover:scale-102 ease-in"
                        src={props.image} alt={props.title}/>
                </Link>
                <LikeButton  itemID={props.id}/>
            </div>
            <figcaption className="flex flex-col">
                <p className="font-semibold">${props.price.toFixed(2)}</p>
                <p className="opacity-95">{props.title}</p>
                <p className="text-sm mt-0.25 opacity-75">{props.category}</p>
            </figcaption>
        </figure>
    );

}