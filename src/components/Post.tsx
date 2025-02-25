'use client'
import Button from "@/components/inputs/Button";
import Image from "next/image";
import Link from "next/link";
import {useSession} from "next-auth/react";
interface PostInput {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
}


export default function Post(props: PostInput) {
    const {data: session} = useSession()
    const usernameSession = session?.user?.name
    async function handleLikes(itemID : string) {
      if(window.location.pathname === "/favorites"){
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
            headers: {'Content-type' : 'application/json'}

        });
        const test = await response.json()
        console.log(test)
    } catch (e) {
        console.error(e);
    }

}

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
                        <Image onClick={() => handleLikes(props._id)} src="/like.svg" alt="Heart Image" width={15} height={15}/>
                    </Button>
                </div>
                <div className="border-t onyx-700 p-2">
                    <h1 className="font-bold text-lg truncate">{props.title}</h1>
                    <h2 className="text-onyx-700">{props.category}</h2>
                    <h2 className="text-onyx-700">${props.price}</h2>
                </div>
            </div>
        </div>
    )
}