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
        <figure className="">
            <div className="relative">
                <Link href={`/listing/${props.id}`}>
                    <img
                        className="w-[250px] h-[250px] rounded-sm object-cover hover:scale-105 duration-150 ease-in-out "
                        src={props.image} alt={props.title}/>
                </Link>
                <LikeButton  itemID={props.id}/>
            </div>
            <figcaption>
                <p className="font-semibold tracking-wider ">${props.price}.00</p>
                <p className="opacity-75">{props.title}</p>
                <p className="opacity-75">{props.category}</p>
            </figcaption>
        </figure>
    );

}