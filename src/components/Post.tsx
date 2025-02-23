'use client'
import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import {getSession} from "next-auth/react";
import {useState} from "react";
interface PostInput {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
}
/*async function handleLikes(itemID) {
    try {
        const response = await fetch("http://localhost:3000/api/likes", {
            method: "POST",
            body: itemID
        });
        console.log("here")
        if (!response.ok) throw new Error(response.statusText);
    } catch (e) {
        console.error(e);
    }

}*/

export default function Post(props: PostInput) {
    const [like, setLikeCount] = useState(0)
    return (
        <div>
            <div className="w-full sm:w-[280px] md:w-[300px] h-auto rounded-b-xl shadow-lg">
                <div className="relative w-full aspect-[5/4]">
                    <Link href={`/listing/${props._id}`}>
                        <Button type="button">
                    <Image priority={false}
                           src={props.image}
                           fill
                           alt={`${props.title}` + " Image"}
                           className="object-cover rounded-t-xl hover:skew-x-3 duration-150 ease-in-out"/>
                        </Button>
                    </Link>
                    <Button  type="button" className="absolute top-2 right-2 z-10 p-2 rounded-full shadow-md bg-white hover:bg-auburn-300">
                        <Image onClick={() => setLikeCount(like+ 1)} src="/like.svg" alt="Heart Image" width={15} height={15}/>
                    </Button>
                </div>
                <div className="border-t onyx-700 p-2">
                    <h1 className="font-bold text-lg truncate">{props.title}</h1>
                    <h2 className="text-onyx-700">{props.category}</h2>
                    <h2 className="text-onyx-700">${props.price}</h2>
                    <p>{like}</p>
                </div>
            </div>
        </div>
    )
}